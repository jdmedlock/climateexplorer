import { gql } from 'apollo-server';

// GraphQL Schema defining the Climate Explorer API
const typeDefs = gql`
  type Query {
    me: User!
    user (email: String!): User!
  }

  type User {
    id: ID!
    name: String
    email: String
  }

  type Mutation {
    login (email: String!): String,
    logoff: Boolean,
  }
`;

module.exports = typeDefs;