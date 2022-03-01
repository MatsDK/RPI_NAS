import gql from "graphql-tag";

export const getDataStoresQuery = gql`
  query GetDataStores {
    getDatastores {
      id
      name
      userId
      localHostNodeId
      localNodeId
      basePath
      sizeInMB
      userInitialized
      size {
        usedSize
        usedPercent
      }
      status
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
