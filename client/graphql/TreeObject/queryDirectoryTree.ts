import gql from "graphql-tag";

export const getDirectoryTreeQuery = gql`
  query getDirectoryTreeQuery($path: String!, $depth: Float!) {
    directoryTree(path: $path, depth: $depth) {
      path
      __typename
      tree {
        isDirectory
        name
        relativePath
        path
        __typename
      }
    }
  }
`;
