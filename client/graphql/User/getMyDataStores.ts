import gql from "graphql-tag";

export const getMyDataStoresQuery = gql`
  query getMyDataStores {
    getMyDatastores {
      id
      name
    }
  }
`;

