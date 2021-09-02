import gql from "graphql-tag";

export const getDirectoryTreeQuery = gql`
  query getDirectoryTreeQuery(
    $path: String!
    $depth: Float!
    $dataStore: Float
  ) {
    directoryTree(path: $path, depth: $depth, dataStore: $dataStore) {
      path
      __typename
      tree {
        isDirectory
        dataStoreId
        name
        relativePath
        path
        __typename
      }
    }
  }
`;
