import gql from "graphql-tag";

export const FindUsersQuery = gql`
  query getUserNameByName($name: String!) {
    getUsersByName(name: $name) {
      userName
      id
    }
  }
`;
