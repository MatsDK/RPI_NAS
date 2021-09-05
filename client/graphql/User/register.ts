import gql from "graphql-tag";

export const registerMutation = gql`
  mutation registerMutation(
    $email: String!
    $password: String!
    $userName: String!
  ) {
    register(
      data: { email: $email, password: $password, userName: $userName }
    ) {
      id
    }
  }
`;
