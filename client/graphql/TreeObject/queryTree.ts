import gql from "graphql-tag";

export const getTreeQuery = gql`
  query getTreeQuery($path: String!, $depth: Float!, $datastoreId: Float) {
    tree(data: { path: $path, dataStoreId: $datastoreId, depth: $depth }) {
      path
      userInitialized
      tree {
        relativePath
        isDirectory
        name
        path
      }
    }
  }
`;
