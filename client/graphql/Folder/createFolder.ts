import gql from "graphql-tag";

export const CreateFolderMutation = gql`
  mutation CreateFolderMutation($path: String!, $dataStoreId: Float!) {
    createFolder(path: $path, dataStoreId: $dataStoreId)
  }
`;
