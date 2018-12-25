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
`;

module.exports = typeDefs;