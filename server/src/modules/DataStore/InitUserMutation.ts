import { gql } from "@apollo/client/core";

export const InitializeUserMutation = gql`
mutation InitUser($userName: String!, $password: String!, $groupName: string) {
	initUser(userName: $userName, password: $password, groupName: $groupName)
}
`