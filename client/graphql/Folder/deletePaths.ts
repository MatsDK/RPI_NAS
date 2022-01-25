import gql from "graphql-tag";

export const DeletePtahsMutation = gql`
  mutation DeleteDataMutation(
    $paths: [DeletePathsInput!]!
    $datastoreId: Float!
  ) {
    delete(paths: $paths, datastoreId: $datastoreId)
  }
`;
