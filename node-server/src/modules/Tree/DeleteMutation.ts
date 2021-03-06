import { gql } from "apollo-server-express";

export const DeleteMutation = gql`
mutation DeleteDataMutation(
	$paths: [DeletePathsInput!]!
	$datastoreId: Float!
) {
	delete(paths: $paths, datastoreId: $datastoreId)
}
`;

export const DeleteOnHostMutation = gql`
mutation DeleteOnHostMutation(
	$paths: [DeletePathsInput!]!
	$sessionToken: String!
	$datastoreId: Float!
) {
	deleteFromRemote(paths: $paths, datastoreId: $datastoreId, sessionToken: $sessionToken)
}
`;