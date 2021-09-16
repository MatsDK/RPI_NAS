import gql from "graphql-tag";

export const getDataStoresQuery = gql`
  query GetDataStores {
    getDataStores {
      id
      name
      userId
      localHostNodeId
      localNodeId
      basePath
      owner {
        id
        userName
        isAdmin
      }
      sharedUsers {
        userName
        isAdmin
        id
      }
    }
  }
`;
