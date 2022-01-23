import { gql } from "@apollo/client/core";

export const UpdateOwnershipMutation = gql`
mutation UpdateOwnership($loginName: String!, $datastoreName: String!, $path: String!) {
	updateOwnership(loginName: $loginName, datastoreName: $datastoreName, path: $path)
}
`