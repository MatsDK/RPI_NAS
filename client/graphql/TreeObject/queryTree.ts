import gql from "graphql-tag";

export const getTreeQuery = gql`
  query getTreeQuery($path: String!, $depth: Float!, $datastoreId: Float) {
    tree(data: { path: $path, datastoreId: $datastoreId, depth: $depth }) {
      path
      userInitialized
      tree {
        relativePath
        isDirectory
        name
        path
        size
      }
    }
  }
`;
