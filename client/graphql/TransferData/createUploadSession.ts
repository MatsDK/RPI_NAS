import gql from "graphql-tag";

export const createUploadSessionMutation = gql`
  mutation createUploadSessionMutation(
    $uploadPath: String!
    $datastoreId: Float!
  ) {
    createUploadSession(
      data: { uploadPath: $uploadPath, datastoreId: $datastoreId }
    ) {
      uploadPath
      hostIp
      username
      port
      password
    }
  }
`;

