import gql from "graphql-tag";

export const createUploadSessionMutation = gql`
  mutation createUploadSessionMutation(
    $uploadPath: String!
    $dataStoreId: Float!
  ) {
    createUploadSession(
      data: { uploadPath: $uploadPath, dataStoreId: $dataStoreId }
    ) {
      uploadPath
      hostIp
      username
      port
      password
    }
  }
`;
