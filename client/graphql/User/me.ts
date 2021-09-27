import gql from "graphql-tag";

export const meQuery = gql`
  query me {
    me {
      email
      id
      userName
      isAdmin
      defaultDownloadPath
    }
  }
`;
