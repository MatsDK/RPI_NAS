import gql from "graphql-tag";

export const getNodesQuery = gql`
  query GetNodesQuery {
    getNodes {
      id
      ip
      name
      loginName
      host
      basePath
      hostNode
    }
  }
`;
