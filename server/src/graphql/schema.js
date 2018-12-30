import { gql } from 'apollo-server';

// GraphQL Schema defining the Climate Explorer API
const typeDefs = gql`
  type Query {
    me: User!
  }

  type User {
    id: ID!
    name: String
  }

  type Mutation {
    login (email: String!): String
  }
`;

module.exports = typeDefs;