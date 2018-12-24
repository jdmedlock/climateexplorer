import { ApolloServer } from 'apollo-server';
import typeDefs from './schema';

// Temporary data for initial testing
const user = {
  id: '1',
  name: 'Jim',
};


const server = new ApolloServer({ 
  typeDefs,
  context: {user}
});

// Start our server if we're not in a test env.
// if we're in a test env, we'll manually start it in a test
if (process.env.NODE_ENV !== 'test')
  server
    .listen({ port: 4000 })
    .then(({ url }) => console.log(`🚀 app running at ${url}`));
