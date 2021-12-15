import gql from "graphql-tag";

export const getNodesQuery = gql`
  query GetNodes {
    getNodes {
      nodes {
        name
        id
        ip
      }
    }
  }
`;
