import dotenv from 'dotenv';

import { ApolloServer } from 'apollo-server';

import isEmail from 'isemail';
import typeDefs from './graphql/schema';
import resolvers from './graphql/resolvers.js';

import Location from './datasources/Location';
import User from './datasources/User';
import FTPAPI from './middleware/FTPAPI';
import MongoAPI from './middleware/MongoAPI';
import PostgresAPI from './middleware/PostgresAPI';

dotenv.config();

// Data sources required by the resolvers. These are available to subclasses
// of DataSource via config.context.
const postgres = new PostgresAPI();
const locationAPI = new Location(postgres);

const mongo = new MongoAPI();
const userAPI = new User(mongo);

const dataSources = () => ({
  userAPI: userAPI,
  locationAPI: locationAPI,
});

// Create the context that will be shared across all resolvers
const context = async ({ req }) => {
  // Check for proper authorization on every request
  const auth = (req.headers && req.headers.authorization) || '';
  const email = Buffer.from(auth, 'base64').toString('ascii');
  if (!isEmail.validate(email)) {
    return { user: null };
  }

  // Locate the user based on their email address.
  // This would normally be via a profile lookup in the db, but for now
  // we're using temporary data for testing.
  const user = await userAPI.findUserByEmail(email);
  return { user: { user } };
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

// Test FTP
let ftpSession_1 = new FTPAPI({
  host_url: process.env.NOAA_FTP_URL, 
  host_port: process.env.NOAA_FTP_PORT, 
  user: process.env.NOAA_FTP_USER, 
  password: process.env.NOAA_FTP_PASSWORD
});
ftpSession_1.connect()
.then(() => {
  ftpSession_1.getDirectory(process.env.NOAA_FTP_GHCN_DIRECTORY)
  .then(list => {
    console.log('Dir list: ', list);
    return ftpSession_1.getFile(`${process.env.NOAA_FTP_GHCN_DIRECTORY}/${process.env.NOAA_FTP_COUNTIES_FILE}`);
  })
  .then(stream => {
    console.log("File contents: ");
    stream.pipe(process.stdout);
    ftpSession_1.disconnect();
  });
});
