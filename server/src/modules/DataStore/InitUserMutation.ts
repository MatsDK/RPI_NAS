import { gql } from "@apollo/client/core";

export const InitializeUserMutation = gql`
mutation InitUser($userName: String!, $password: String!, $groupNames: [String!]!) {
	initUser(userName: $userName, password: $password, groupNames: $groupNames)
}
`