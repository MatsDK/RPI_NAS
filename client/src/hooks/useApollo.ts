import { MutationUpdaterFn } from "apollo-boost";
import { DocumentNode } from "graphql";
import { useApolloClient } from "react-apollo";

interface MutationOptions {
  refetchQueries?: Array<{ query: any; variables: any }>;
  update?: MutationUpdaterFn<any>;
}

export const useApollo = () => {
  const client = useApolloClient();

  const mutate = (
    mutation: DocumentNode,
    variables: any,
    options: MutationOptions = {}
  ) => client.mutate({ mutation, variables, ...options });

  const query = (query: DocumentNode, variables: any) =>
    client.query({ query, variables });

  return { mutate, query };
};
