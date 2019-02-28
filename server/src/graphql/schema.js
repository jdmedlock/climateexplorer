import { gql } from 'apollo-server';

// GraphQL Schema defining the Climate Explorer API
const typeDefs = gql`
  type Query {
    countries: [Country]
    me: User!
    user (email: String!): User!
  }

  type Country {
    code: String
    name: String
  }

  type LoadMetrics {
    file_name: String
    no_loaded: Int
    no_errors: Int
  }

  type User {
    id: ID!
    name: String
    email: String
  }

  type Mutation {
    extract : Boolean,
    login (email: String!): String,
    logoff: Boolean,
    loadCountries: [Country]
  }
`;

module.exports = typeDefs;