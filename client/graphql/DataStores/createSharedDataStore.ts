import gql from "graphql-tag";

export const CreateSharedDataStoreMutation = gql`
  mutation CreateSharedDataStoresMutaion(
    $userIds: [Float!]!
    $dataStoreIds: [Float!]!
  ) {
    createSharedDataStore(
      data: { userIds: $userIds, dataStoreIds: $dataStoreIds }
    )
  }
`;
