import { gql } from "@apollo/client/core";

export const CreateDirectoryMutation = gql`
mutation CreateDirectory(
  $path: String!
  $datastoreName: String!
  $loginName: String!
) {
  createDir(path: $path, datastoreName: $datastoreName, loginName: $loginName)
}
`