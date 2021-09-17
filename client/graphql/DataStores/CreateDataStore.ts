import gql from "graphql-tag";

export const CreateDataStoreMutation = gql`
  mutation CreateDataStoreMution($localNodeId: Float!, $name: String!) {
    createDataStore(data: { localNodeId: $localNodeId, name: $name }) {
      id
    }
  }
`;
