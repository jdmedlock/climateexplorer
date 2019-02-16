import dotenv from 'dotenv';

import { ApolloServer } from 'apollo-server';

import isEmail from 'isemail';
import typeDefs from './graphql/schema';
import resolvers from './graphql/resolvers.js';

import Country from './datasources/Country';
import User from './datasources/User';
import FTPAPI from './middleware/FTPAPI';
import MongoAPI from './middleware/MongoAPI';
import PostgresAPI from './middleware/PostgresAPI';

dotenv.config();

// Data sources required by the resolvers. These are available to subclasses
// of DataSource via config.context.
const ftpSession = new FTPAPI( {
  host_url: process.env.NOAA_FTP_URL, 
  host_port: process.env.NOAA_FTP_PORT, 
  user: process.env.NOAA_FTP_USER, 
  password: process.env.NOAA_FTP_PASSWORD
} );
const mongo = new MongoAPI();
const postgres = new PostgresAPI();
const country = new Country(mongo);
const user = new User(postgres);

const dataSources = () => ({
  ftpSession: ftpSession,
  country : country,
  user: user,
});

// Create the context that will be shared across all resolvers
const context = async ({ req }) => {
  // Check for proper authorization on every request
  const auth = (req.headers && req.headers.authorization) || '';
  const userEmail = Buffer.from(auth, 'base64').toString('ascii');
  if (!isEmail.validate(userEmail)) {
    return { user: null };
  }

  // Locate the user based on their email address.
  // This would normally be via a profile lookup in the db, but for now
  // we're using temporary data for testing.
  const userName = await user.findUserByEmail(userEmail);
  return { user: { userName } };
};

// Create and start the Apollo Server
// In the test env, we'll manually start it as part of the test script
const server = new ApolloServer({ 
  typeDefs,
  dataSources,
  context,
  resolvers,
});

if (process.env.NODE_ENV !== 'test') {
  server
    .listen({ port: 4000 })
    .then(({ url }) => console.log(`🚀 app running at ${url}`));
}
