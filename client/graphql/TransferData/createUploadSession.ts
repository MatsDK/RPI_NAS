import gql from "graphql-tag";

export const createUploadSessionMutation = gql`
  mutation createUploadSessionMutation($uploadPath: String!) {
    createUploadSession(uploadPath: $uploadPath) {
      uploadPath
      hostIp
      username
      port
      password
    }
  }
`;
