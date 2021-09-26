import gql from "graphql-tag";

export const SendFriendRequestMutation = gql`
  mutation SendFriendRequest($userId: Float!) {
    sendFriendRequest(userId: $userId)
  }
`;
