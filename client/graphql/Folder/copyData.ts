import gql from "graphql-tag";

export const CopyDataMutation = gql`
  mutation CopyDataMutation(
    $dataStoreId: Float!
    $destination: CopyMoveDestinationObject!
    $data: [CopyMoveDataObject!]!
  ) {
    copy(
      data: {
        datastoreId: $dataStoreId
        destination: $destination
        data: $data
      }
    )
  }
`;
