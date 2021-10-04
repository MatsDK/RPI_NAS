import gql from "graphql-tag";

export const CreateDataStoreMutation = gql`
  mutation CreateDataStoreMution(
    $localNodeId: Float!
    $name: String!
    $sizeInMb: Float!
    $ownerId: Float!
  ) {
    createDataStore(
      data: {
        localNodeId: $localNodeId
        name: $name
        sizeInMB: $sizeInMb
        ownerId: $ownerId
      }
    ) {
      id
    }
  }
`;
