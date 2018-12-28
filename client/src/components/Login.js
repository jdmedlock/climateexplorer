import React from 'react';
import { ApolloConsumer, Mutation } from 'react-apollo';

import LoginForm from './LoginForm';
import { LOGIN_USER } from '../graphql/mutations';

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
            // this loading state will probably never show, but it's helpful to
            // have for testing
            if (loading) return <p>Loading...</p>;
            if (error) return <p>An error occurred</p>;

            return <LoginForm login={login} />;
          }}
        </Mutation>
      )}
    </ApolloConsumer>
  );
}

export default Login;
