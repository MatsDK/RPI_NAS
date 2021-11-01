import gql from "graphql-tag";

export const UpdateDatastoreMutation = gql`
  mutation UpdateDatastoreMutation(
    $datastoreId: Float!
    $sharedUsers: [Float!]
    $name: String
    $ownerSMBEnabled: Boolean
    $allowedSMBUsers: [AllowedSMBUser!]
  ) {
    updateDatastore(
      dataStoreId: $datastoreId
      updateProps: {
        sharedusers: $sharedUsers
        allowedSMBUsers: $allowedSMBUsers
        name: $name
        ownerSMBEnabled: $ownerSMBEnabled
      }
    )
  }
`;
