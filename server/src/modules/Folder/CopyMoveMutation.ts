import { gql } from "@apollo/client/core";

export const CopyMoveMutation = gql`
mutation CopyAndMoveMutation(
  $type: String!
  $remote: Boolean!
  $srcNode: Node!
  $downloadDirectories: [CopyMovePath!]!
  $downloadFiles: [CopyMovePath!]!
) {
  copyAndMove(
    data: {
      type: $type
      remote: $remote
      srcNode: $srcNode
      downloadDirectories: $downloadDirectories
      downloadFiles: $downloadFiles
    }
  )
}
`