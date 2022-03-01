import gql from "graphql-tag";

export const getDirectoryTreeQuery = gql`
  query getDirectoryTreeQuery(
    $path: String!
    $depth: Float!
    $datastoreId: Float
  ) {
    directoryTree(
      data: { path: $path, depth: $depth, datastoreId: $datastoreId }
    ) {
      path
      __typename
      tree {
        isDirectory
        datastoreId
        sharedDatastore
        name
        relativePath
        path
        __typename
      }
    }
  }
`;

