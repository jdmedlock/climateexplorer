import gql from 'graphql-tag';

export const LOGIN_USER = gql`
  mutation login($email: String!) {
    login(email: $email)
  }
`;

export const LOGOFF_USER = gql`
  mutation logoff {
    logoff
  }
`;


export const EXTRACT_COUNTIES = gql`
  mutation extractCountries {
    extractCountries
  }
`;