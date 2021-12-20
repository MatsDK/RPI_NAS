import gql from "graphql-tag";

export const getNodesQuery = gql`
query GetNodesQuery {
  getNodes {
    nodes {
      id
      ip
      name
      loginName
      basePath
      hostNode
    }
    nodeRequests {
      id
      ip
      port
    }
  }
}
`;
