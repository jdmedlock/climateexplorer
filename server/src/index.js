import { ApolloServer } from 'apollo-server';

import isEmail from 'isemail';
import typeDefs from './graphql/schema';
import resolvers from './graphql/resolvers.js';

import UserAPI from './datasources/user';

// Data sources required by the resolvers
const dataSources = () => ({
  userAPI: new UserAPI(),
});

// Create the context that will be shared across all resolvers
const context = async ({ req }) => {
  // Check for proper authorization on every request
  const auth = (req.headers && req.headers.authorization) || '';
  const email = new Buffer(auth, 'base64').toString('ascii');
  console.log('email: ', email);
  console.log('auth: ', auth);
  console.log('req.headers: ', req.headers);
  console.log('req.body: ', req.body);
  if (!isEmail.validate(email)) {
    return { user: null };
  }

  // Locate the user based on their email address.
  // This would normally be via a profile lookup in the db, but for now
  // we're using temporary data for testing.
  const user = dataSources.userAPI.findUserByEmail(email);
  console.log('user: ', user.email);
  return { user: { user } };
};

// Create and start the Apollo Server
// In the test env, we'll manually start it as part of the test script
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
