import gql from "graphql-tag";

export const AcceptNodeRequestMutation = gql`
mutation AcceptNodeRequest(
  $id: Float!
  $name: String!
  $loginName: String!
  $password: String!
) {
  acceptNodeRequest(
    data: { id: $id, name: $name, loginName: $loginName, password: $password }
  ) {
    id
  }
}
`