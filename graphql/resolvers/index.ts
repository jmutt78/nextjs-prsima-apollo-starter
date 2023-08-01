import { Resolvers } from '../graphql';
import { UserResolvers } from './UserResolvers';

export const resolvers: Resolvers = {
  Query: {
    ...UserResolvers.Query,
  },
  Mutation: {
    ...UserResolvers.Mutation,
  },
};
