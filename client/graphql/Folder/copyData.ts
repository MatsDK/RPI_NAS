import gql from "graphql-tag";

export const CopyDataMutation = gql`
  mutation CopyDataMutation(
    $dataStoreId: Float!
    $destination: CopyDestinationObject!
    $data: [CopyDataObject!]!
  ) {
    copy(
      data: {
        dataStoreId: $dataStoreId
        destination: $destination
        data: $data
      }
    )
  }
`;
