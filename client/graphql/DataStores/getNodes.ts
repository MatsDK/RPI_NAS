import gql from "graphql-tag";

export const getNodesQuery = gql`
  query GetNodes {
    getNodes {
      name
      id
      host
    }
  }
`;
