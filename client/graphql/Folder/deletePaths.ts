import gql from "graphql-tag";

export const DeletePtahsMutation = gql`
  mutation DeleteDataMutation(
    $paths: [DeletePathsInput!]!
    $dataStoreId: Float!
  ) {
    delete(paths: $paths, dataStoreId: $dataStoreId)
  }
`;
