import gql from "graphql-tag";

export const createSessionMutation = gql`
  mutation createSession($data: [DownloadSessionInput!]!, $type: String!) {
    createDownloadSession(data: $data, type: $type) {
      data {
        type
        path
      }
      hostIp
      username
      password
      port
      id
    }
  }
`;
