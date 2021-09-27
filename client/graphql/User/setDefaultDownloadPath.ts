import gql from "graphql-tag";

export const setDefaultDownloadPathMutation = gql`
  mutation SetDefaultDownloadPath($path: String!) {
    setDefaultDownloadPath(path: $path)
  }
`;
