import gql from "graphql-tag";

export const getNodesQuery = gql`
query GetNodesQuery {
  getNodes {
    nodes {
      id
      ip
      port
      name
      loginName
      basePath
      hostNode
      pingResult
      token
    }
    nodeRequests {
      id
      ip
      port
    }
  }
}
`;
