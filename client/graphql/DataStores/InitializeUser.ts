import gql from "graphql-tag";

export const InitializeUserMutation = gql`
mutation InitializeUser($datastoreId: Float!, $password: String!) {
  initUser(password: $password, datastoreId: $datastoreId)
}
`