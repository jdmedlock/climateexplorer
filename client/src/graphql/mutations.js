import gql from 'graphql-tag';

export const LOGIN_USER = gql`
  mutation login($email: String!) {
    login(email: $email)
  }
`;