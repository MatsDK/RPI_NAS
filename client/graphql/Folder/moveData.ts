import gql from "graphql-tag";

export const MoveDataMutation = gql`
  mutation MoveDataMutation(
    $datastoreId: Float!
    $destination: CopyMoveDestinationObject!
    $data: [CopyMoveDataObject!]!
  ) {
    move(
      data: {
        datastoreId: $datastoreId
        destination: $destination
        data: $data
      }
    )
  }
`;
