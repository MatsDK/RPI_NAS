import gql from "graphql-tag";

export const CopyDataMutation = gql`
  mutation CopyDataMutation(
    $datastoreId: Float!
    $destination: CopyMoveDestinationObject!
    $data: [CopyMoveDataObject!]!
  ) {
    copy(
      data: {
        datastoreId: $datastoreId
        destination: $destination
        data: $data
      }
    )
  }
`;
