import { gql } from "@apollo/client/core";

export const CopyMoveMutation = gql`
mutation CopyAndMoveMutation(
  $type: String!
  $remote: Boolean!
  $srcNode: Node!
  $srcDatastoreId: Float!
  $downloadDirectories: [CopyMovePath!]!
  $downloadFiles: [CopyMovePath!]!
) {
  copyAndMove(
    data: {
      type: $type
      remote: $remote
      srcNode: $srcNode
      srcDatastoreId: $srcDatastoreId
      downloadDirectories: $downloadDirectories
      downloadFiles: $downloadFiles
    }
  )
}
`