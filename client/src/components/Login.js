import React from 'react';
import { ApolloConsumer, Mutation } from 'react-apollo';

import LoginForm from './LoginForm';
import { LOGIN_USER } from '../graphql/mutations';

// Login by invoking a mutation to pass the user email to the server and
// saving the token that is returned in local storage. This token will be 
// passed on all subsequent API calls to the server to authenticate that
// they are from a trusted source.
const Login = (props) => {
  return (
    <ApolloConsumer>
      {client => (
        <Mutation
          mutation={ LOGIN_USER }
          onCompleted={({ login }) => {
            localStorage.setItem('token', login);
            client.writeData({ data: { isLoggedIn: true } });
          }}
        >
          {(login, { loading, error }) => {
            if (loading) {
              return <p>Loading...</p>;
            }
            if (error) {
              return <p>An error occurred</p>;
            }
            return <LoginForm login={login} />;
          }}
        </Mutation>
      )}
    </ApolloConsumer>
  );
}

export default Login;
