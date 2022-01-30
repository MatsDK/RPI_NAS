import gql from "graphql-tag";

export const InitializeUserMutation = gql`
mutation InitializeUser($nodeId: Float!, $password: String!) {
  initUser(password: $password, nodeId: $nodeId)
}
`