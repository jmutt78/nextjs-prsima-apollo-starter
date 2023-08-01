import {
  getAuth,
  createUserWithEmailAndPassword,
  UserCredential,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithCredential,
} from 'firebase/auth';
import { Context } from '../../pages/api/graphql';
import { Role } from '@prisma/client';
import { FirebaseError } from 'firebase/app';
import {
  MutationCreateUserArgs,
  MutationPasswordResetArgs,
  MutationSignInWithGoogleArgs,
  MutationUserSignInArgs,
} from '../graphql';
import { serialize } from 'cookie';
import redis from '../../lib/redis';
const jwt = require('jsonwebtoken');

export const UserResolvers = {
  Query: {
    users: async (_parent: unknown, _args: any, context: Context) => {
      const users = await context.prisma.user.findMany({
        include: { notes: { include: { insights: true, noteConnections: true } } },
      });

      return users;
    },
    user: async (_parent: any, args: any, context: Context) => {
      const user = await context.prisma.user.findUnique({
        where: { id: args.id },
        include: {
          notes: true,
        },
      });
      return user;
    },
    me: async (_parent: unknown, _args: any, context: Context) => {
      try {
        //check the token from the cookie and get the user id
        const token = context.req.cookies.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET ?? '');
        const cachedUser = await redis.get(decoded.userId);
        if (!cachedUser) return null; //if the user is not in the cache, return null
        //check if the cached user is in the db
        const user = await context.prisma.user.findUnique({ where: { id: decoded.userId } });
        if (!user) throw new Error('User not found');
        return user;
      } catch (error) {
        console.error('Invalid token');
        return error;
      }
    },
  },

  Mutation: {
    createUser: async (_parent: unknown, args: MutationCreateUserArgs, context: Context) => {
      const { email, password } = args;
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      const auth = getAuth(context.firebase_app);

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        const firebaseUser = userCredential.user;

        const user = await context.prisma.user.create({
          data: {
            id: firebaseUser.uid,
            email,
            role: Role.FREE_TRIAL_USER,
          },
          include: { notes: true },
        });

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

        const cookieString = serialize('token', token, {
          httpOnly: true,
          maxAge: 60 * 60 * 24, // 24 hours
          path: '/',
          sameSite: 'strict',
          secure: process.env.NODE_ENV === 'production', // This ensures the 'Secure' flag is only set in production
        });

        context.res.setHeader('Set-Cookie', cookieString);

        return user;
      } catch (error) {
        if (error instanceof FirebaseError) {
          console.log('Error creating user: ', error.code, error.message);
          throw new Error('Error creating user: ' + error.message);
        }
        throw error;
      }
    },
    userSignIn: async (_parent: unknown, args: MutationUserSignInArgs, context: Context) => {
      const { email, password } = args;
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      const auth = getAuth(context.firebase_app);
      let userCredential: UserCredential;

      try {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } catch (error) {
        if (!(error instanceof FirebaseError)) throw error;
        console.error('Error signing in: ', error.code, error.message);
        throw new Error('Error signing in: ' + error.message);
      }

      const firebaseUser = userCredential.user;

      // Fetch user from database
      const user = await context.prisma.user.findUnique({
        where: { id: firebaseUser.uid },
      });

      if (!user) {
        throw new Error('No such user found');
      }

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

      const cookieString = serialize('token', token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production', // This ensures the 'Secure' flag is only set in production
      });

      context.res.setHeader('Set-Cookie', cookieString);

      return user;
    },
    signInWithGoogle: async (
      _parent: unknown,
      args: MutationSignInWithGoogleArgs,
      context: Context
    ) => {
      const { token: googleToken } = args;
      const auth = getAuth(context.firebase_app);
      const credential = GoogleAuthProvider.credential(googleToken);
      let userCredential;
      try {
        userCredential = await await signInWithCredential(auth, credential);
      } catch (error) {
        if (!(error instanceof FirebaseError)) throw error;
        console.error('Error signing in: ', error.code, error.message);
        throw new Error('Error signing in: ' + error.message);
      }

      const firebaseUser = userCredential.user;

      // find or create the user in your own database
      // Fetch user from database
      let user = await context.prisma.user.findUnique({
        where: { id: firebaseUser.uid },
      });

      if (!user) {
        user = await context.prisma.user.create({
          data: {
            id: firebaseUser.uid,
            email: firebaseUser?.email || '',
            role: Role.FREE_TRIAL_USER,
          },
          include: { notes: true },
        });
      }

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

      const cookieString = serialize('token', token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production', // This ensures the 'Secure' flag is only set in production
      });

      context.res.setHeader('Set-Cookie', cookieString);

      return user;
    },
    signOut: (_parent: unknown, _args: any, context: Context) => {
      const cookieString = serialize('token', '', {
        httpOnly: true,
        expires: new Date(0), // This will set the cookie to expire immediately
        path: '/',
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production', // This ensures the 'Secure' flag is only set in production
      });
      context.res.setHeader('Set-Cookie', cookieString);
      const token = context.req.cookies.token;
      redis.del(token as string);
      return true;
    },
    deleteUser: async (_parent: any, args: any, context: Context) => {
      const { id } = args;
      return await context.prisma.user.delete({ where: { id } });
    },
    passwordReset: async (_parent: any, args: MutationPasswordResetArgs, context: Context) => {
      const { email } = args;
      const auth = getAuth(context.firebase_app);

      try {
        await sendPasswordResetEmail(auth, email);
        return { message: 'Password reset email sent' };
      } catch (error) {
        if (!(error instanceof FirebaseError)) throw error;
        console.error('Error requesting password reset: ', error.code, error.message);
        throw new Error('Error requesting password reset: ' + error.message);
      }
    },
  },
};
