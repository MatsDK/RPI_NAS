import gql from "graphql-tag";

export const createSessionMutation = gql`
  mutation createSession($data: [DownloadSessionInput!]!) {
    createDownloadSession(data: $data)
  }
`;
