import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { PrismaClient, User } from '@prisma/client';
import { typeDefs } from '../../graphql/schema';
import { resolvers } from '../../graphql/resolvers';
import { prisma } from '../../prisma/db';
import { FirebaseApp } from 'firebase/app';
import firebase_app from '../../firebase/config';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { parse } from 'cookie';
import { Redis } from 'ioredis';
import redis from '../../lib/redis';
import { NextApiRequest, NextApiResponse } from 'next';

export type Context = {
  req: NextApiRequest;
  res: NextApiResponse;
  prisma: PrismaClient;
  firebase_app: FirebaseApp;
  user: User;
  redis: Redis;
};

const apolloServer = new ApolloServer<Context>({ typeDefs, resolvers });

const getLoggedInUser = async (req: any) => {
  // access the user's cookie
  const cookies = parse(req.headers.cookie || '');
  const token = cookies.token;

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET ?? '') as JwtPayload;
    const cachedUser = await redis.get(decoded.userId);

    if (cachedUser) {
      return JSON.parse(cachedUser);
    } else {
      const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
      await redis.set(decoded.userId, JSON.stringify(user), 'EX', 60 * 60 * 24); // 24 hours

      return user;
    }
  } catch (error) {
    console.error('Invalid token');
    return null;
  }
};

export default startServerAndCreateNextHandler(apolloServer, {
  context: async (req, res) => {
    const user = await getLoggedInUser(req);
    return { req, res, prisma, firebase_app, user, redis };
  },
});
