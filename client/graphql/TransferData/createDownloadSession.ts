import gql from "graphql-tag";

export const createSessionMutation = gql`
  mutation createSession(
    $data: [DownloadPathsInput!]!
    $type: String!
    $datastoreId: Float!
  ) {
    createDownloadSession(
      data: { type: $type, downloadPaths: $data, datastoreId: $datastoreId }
    ) {
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
