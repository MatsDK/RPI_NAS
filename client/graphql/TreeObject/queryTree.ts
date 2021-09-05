import gql from "graphql-tag";

export const getTreeQuery = gql`
  query getTreeQuery($path: String!, $depth: Float!, $dataStoreId: Float) {
    tree(data: { path: $path, dataStoreId: $dataStoreId, depth: $depth }) {
      path
      __typename
      tree {
        relativePath
        isDirectory
        name
        path
        __typename
      }
    }
  }
`;
