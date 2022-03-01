import gql from "graphql-tag";

export const CreateSharedDataStoreMutation = gql`
  mutation CreateSharedDataStoresMutaion($ids: [SharedDataStoresIdsInput!]!) {
    createSharedDatastore(data: { ids: $ids })
  }
`;
