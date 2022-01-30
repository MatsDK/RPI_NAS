import { gql } from "@apollo/client/core";

export const UpdateSharedUsersMutation = gql`
mutation UpdateSharedUsersMutation($newUsers: [String!]!, $removedUsers: [String!]!, $groupName: String!) {
	addUsersToGroup(newUsers: $newUsers, removedUsers: $removedUseres, groupName: $groupName)
}
`