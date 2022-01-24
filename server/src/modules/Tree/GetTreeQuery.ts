import { gql } from "@apollo/client/core";

export const GetTreeQuery = gql`
query GetTreeQuery(
  $path: String!
  $basePath: String!
  $depth: Float!
  $directoryTree: Boolean!
) {
  queryTree(
    path: $path
    basePath: $basePath
    depth: $depth
    directoryTree: $directoryTree
  ) {
    tree {
      name
      path
      relativePath
      isDirectory
      size
    }
  }
}
`