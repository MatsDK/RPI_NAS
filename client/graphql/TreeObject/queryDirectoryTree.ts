import gql from "graphql-tag";

export const getDirectoryTreeQuery = gql`
  query getDirectoryTreeQuery(
    $path: String!
    $depth: Float!
    $datastoreId: Float
  ) {
    directoryTree(
      data: { path: $path, depth: $depth, dataStoreId: $datastoreId }
    ) {
      path
      __typename
      tree {
        isDirectory
        dataStoreId
        sharedDataStore
        name
        relativePath
        path
        __typename
      }
    }
  }
`;
