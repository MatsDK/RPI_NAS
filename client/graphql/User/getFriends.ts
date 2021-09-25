import gql from "graphql-tag";

export const GetFriendsQuery = gql`
  query GetFriendsQuery {
    friends {
      id
      userName
    }
  }
`;
