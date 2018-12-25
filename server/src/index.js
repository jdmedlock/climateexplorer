import { ApolloServer } from 'apollo-server';
import typeDefs from './schema';
import resolvers from './resolvers.js';

// Data sources required by the resolvers
const dataSources = () => ({
  // Temporary data for initial testing
  user: {
    id: '1',
    name: 'Joe User',
  }
});

// Shared context shared across all resolvers
const context = null;

// Create and start the Apollo Server
// In the test env, we'll manually start from the test
const server = new ApolloServer({ 
  typeDefs,
  resolvers,
  dataSources,
  context,
});

if (process.env.NODE_ENV !== 'test')
  server
    .listen({ port: 4000 })
    .then(({ url }) => console.log(`🚀 app running at ${url}`));
