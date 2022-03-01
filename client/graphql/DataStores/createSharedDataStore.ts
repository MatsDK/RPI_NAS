import gql from "graphql-tag";

export const CreateSharedDataStoreMutation = gql`
  mutation CreateSharedDataStoresMutaion($ids: [SharedDatastoresIdsInput!]!) {
    createSharedDatastore(data: { ids: $ids })
  }
`;

