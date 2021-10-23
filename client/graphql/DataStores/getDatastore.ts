import gql from "graphql-tag";

export const getDatastoreQuery = gql`
  query getDatastore($datastoreId: Float!) {
    getDatastore(datastoreId: $datastoreId) {
      id
      name
      userId
      localHostNodeId
      localNodeId
      basePath
      sizeInMB
      smbEnabled
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
