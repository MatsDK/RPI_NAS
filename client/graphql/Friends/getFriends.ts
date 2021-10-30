import gql from "graphql-tag";

export const GetFriendsAndFriendRequestsQuery = gql`
  query GetFriendsAndFriendRequestsQuery {
    friends {
      friends {
        id
        userName
      }
      friendsRequest {
        id
        userName
      }
    }
  }
`;

export const getFriendsQuerys = gql`
  query getFriendsQuery {
    getFriends {
      id
      userName
    }
  }
`;
