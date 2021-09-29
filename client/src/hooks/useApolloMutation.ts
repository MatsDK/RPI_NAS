import { DocumentNode } from "graphql";
import { useApolloClient } from "react-apollo";

export const useApollo = () => {
  const client = useApolloClient();

  const mutate = (mutation: DocumentNode, variables: any) =>
    client.mutate({ mutation, variables });

  const query = (query: DocumentNode, variables: any) =>
    client.query({ query, variables });

  return { mutate, query };
};
