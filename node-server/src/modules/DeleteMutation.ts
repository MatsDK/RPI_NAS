import { gql } from "apollo-server-express";

export const DeleteMutation = gql`
mutation DeleteDataMutation(
	$paths: [DeletePathsInput!]!
	$datastoreId: Float!
) {
	delete(paths: $paths, datastoreId: $datastoreId)
}
`;