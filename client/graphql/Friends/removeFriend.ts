import gql from "graphql-tag";

export const removeFriendMutation = gql`
mutation removeFriend($userId: Float!) {
	removeFriend(userId: $userId)
}
`