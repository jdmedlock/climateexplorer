import { gql } from 'apollo-server';

// GraphQL Schema defining the Climate Explorer API
const typeDefs = gql`
  type Query {
    me: User!
    locations: [Location!]
    user (email: String!): User!
  }

  type Location {
    id: Int
    name: String
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