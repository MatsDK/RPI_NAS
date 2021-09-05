import gql from "graphql-tag";

export const getDirectoryTreeQuery = gql`
  query getDirectoryTreeQuery(
    $path: String!
    $depth: Float!
    $dataStoreId: Float
  ) {
    directoryTree(
      data: { path: $path, depth: $depth, dataStoreId: $dataStoreId }
    ) {
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
