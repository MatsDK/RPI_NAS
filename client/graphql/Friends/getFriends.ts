import gql from "graphql-tag";

export const GetFriendsQuery = gql`
  query GetFriendsQuery {
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
