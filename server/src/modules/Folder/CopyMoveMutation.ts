import { gql } from "@apollo/client/core";

export const CopyMoveMutation = gql`
mutation CopyAndMoveMutation(
  $type: String!
  $nodeLoginName: String!
  $datastoreName: String!
  $datastoreBasePath: String!
  $remote: Boolean!
  $srcNode: Node!
  $srcDatastoreId: Float!
  $downloadDirectories: [CopyMovePath!]!
  $downloadFiles: [CopyMovePath!]!
) {
  copyAndMove(
    data: {
      type: $type
      nodeLoginName: $nodeLoginName
      datastoreName: $datastoreName
      datastoreBasePath: $datastoreBasePath
      remote: $remote
      srcNode: $srcNode
      srcDatastoreId: $srcDatastoreId
      downloadDirectories: $downloadDirectories
      downloadFiles: $downloadFiles
    }
  )
}
`