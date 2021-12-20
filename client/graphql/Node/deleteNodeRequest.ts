import gql from "graphql-tag";

export const DeleteNodeRequestMutation = gql`
mutation DeleteNodeRequestMutation($id:Float!) {
  deleteNodeRequest(id:$id) 
}
`