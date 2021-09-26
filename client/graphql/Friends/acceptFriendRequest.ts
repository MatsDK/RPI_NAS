import gql from "graphql-tag";

export const acceptFriendRequestMutation = gql`
  mutation AcceptFriendRequest($userId: Float!) {
    acceptFriendRequest(userId: $userId)
  }
`;
