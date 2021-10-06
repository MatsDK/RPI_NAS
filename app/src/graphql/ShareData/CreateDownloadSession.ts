import gql from "graphql-tag";

export const createSessionMutation = gql`
  mutation createSession(
    $data: [DownloadPathsInput!]!
    $type: String!
    $dataStoreId: Float!
  ) {
    createDownloadSession(
      data: { type: $type, downloadPaths: $data, dataStoreId: $dataStoreId }
    ) {
      id
    }
  }
`;
