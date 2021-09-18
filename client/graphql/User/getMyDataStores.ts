import gql from "graphql-tag";

export const getMyDataStoresQuery = gql`
  query getMyDataStores {
    getMyDataStores {
      id
      name
    }
  }
`;
