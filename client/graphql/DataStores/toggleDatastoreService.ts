import gql from "graphql-tag";

export const ToggleDatastoreServiceMutation = gql`
  mutation ToggleDatastoreServiceMutation(
    $serviceName: String!
    $datastoreId: Float!
  ) {
    toggleDatastoreService(serviceName: $serviceName, dataStoreId: $datastoreId)
  }
`;
