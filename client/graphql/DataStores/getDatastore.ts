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
      size {
        usedSize
        usedPercent
      }
      status
      owner {
        id
        userName
        smbEnabled
        isAdmin
      }
      sharedUsers {
        id
        userName
        smbEnabled
        isAdmin
      }
    }
  }
`;
