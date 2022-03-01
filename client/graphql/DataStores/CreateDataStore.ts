import gql from "graphql-tag";

export const CreateDataStoreMutation = gql`
  mutation CreateDataStoreMution(
    $localNodeId: Float!
    $name: String!
    $sizeInMb: Float!
    $ownerId: Float!
    $ownerPassword: String
  ) {
    createDatastore(
      data: {
        localNodeId: $localNodeId
        name: $name
        sizeInMB: $sizeInMb
        ownerId: $ownerId
        ownerPassword: $ownerPassword
      }
    ) {
      id
    }
  }
`;
