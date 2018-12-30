import { ApolloClient } from "apollo-client";
import { ApolloProvider } from 'react-apollo';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './App';
import { resolvers, typeDefs } from './graphql/resolvers';
import * as serviceWorker from './serviceWorker';

const cache = new InMemoryCache();
const token = localStorage.getItem('token');
const client = new ApolloClient({
  cache,
  link: new HttpLink({
    uri: 'http://localhost:4000/graphql',
    headers: {
      authorization: token ? token : "",
      'client-name': 'Climate Explorer',
      'client-version': '1.0.0',
    },
  }),
  initializers: {
    isLoggedIn: () => false,
  },
  resolvers,
  typeDefs
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
