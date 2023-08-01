export const typeDefs = `#graphql 
  enum Role {
    USER
    SUPERUSER
    FREE_TRIAL_USER
  }

type Message {
  message: String!
}

type User {
  id: ID!
  email: String!
  password: String!
  role: Role!
  name: String
  image: String
  createdAt: String!
  updatedAt: String!
  notes: [Note]
}

type Note {
  id: ID!
  title: String!
  content: String!
  createdAt: String!
  updatedAt: String!
  user: User!
  insights: [Insight]
  noteConnections: [NoteConnection]
}

  type Insight {
    id: ID!
    content: String!
    createdAt: String!
    updatedAt: String!
    note: Note!
  }

  type NoteConnection {
    id: ID!
    note: Note!
    connectedNoteId: String!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
    me: User
  }

  type Mutation {
    createUser(email: String!, role: Role, name: String, image: String, password: String): User!
    userSignIn(email: String!, password: String!): User
    deleteUser(id: ID!): User
    signOut: Boolean
    passwordReset(email: String!): Message!
    signInWithGoogle(token: String!): User
  }
`;
