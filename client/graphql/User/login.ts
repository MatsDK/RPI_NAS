import gql from "graphql-tag";

export const loginMutation = gql`
  mutation loginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
    }
  }
`;
