import gql from "graphql-tag";

export const MoveDataMutation = gql`
  mutation MoveDataMutation(
    $dataStoreId: Float!
    $destination: CopyMoveDestinationObject!
    $data: [CopyMoveDataObject!]!
  ) {
    move(
      data: {
        dataStoreId: $dataStoreId
        destination: $destination
        data: $data
      }
    )
  }
`;
