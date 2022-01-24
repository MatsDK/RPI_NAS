import gql from "graphql-tag";

export const CreateFolderMutation = gql`
  mutation CreateFolderMutation($path: String!, $datastoreId: Float!) {
    createFolder(path: $path, datastoreId: $datastoreId)
  }
`;
