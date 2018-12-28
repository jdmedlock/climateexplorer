import { ApolloServer } from 'apollo-server';
import typeDefs from './schema';
import resolvers from './resolvers.js';

// Data sources required by the resolvers
const dataSources = () => ({
  // Temporary data for initial testing
  user: {
    id: '1',
    name: 'Joe User',
    email: 'joe@gmail.com'
  },
  user: {
    id: '2',
    name: 'Jane Doe',
    email: 'jane@gmail.com'
  }
});

// Create the context that will be shared across all resolvers
const context = async ({ req }) => {
  // Check for proper authorization on every request
  const auth = (req.headers && req.headers.authorization) || '';
  const email = Buffer.from(auth, 'base64').toString('ascii');
  console.log('email: ', email);
  console.log('auth: ', auth);
  console.log('req.headers: ', req.headers);
  if (!isEmail.validate(email)) {
    return { user: null };
  }

  // Locate the user based on their email address.
  // This would normally be via a profile lookup in the db, but for now
  // we're using temporary data for testing.
  let user = dataSources.find((user) => {
    return user.email === email;
  });
  user = users && users[0] ? users[0] : null;
  console.log('user: ', user);

  return { user };
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
