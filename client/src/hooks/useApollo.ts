import { MutationUpdaterFn } from "apollo-boost";
import { DocumentNode } from "graphql";
import { useApolloClient } from "react-apollo";

interface MutationOptions {
  refetchQueries?: Array<{ query: any; variables: any }>;
  update?: MutationUpdaterFn<any>;
}

interface Options {
  context?: string;
}

export const useApollo = (apolloOptions?: Options) => {
  const client = useApolloClient();

  const globalOptions: any = {};

  if (apolloOptions?.context) globalOptions.context = apolloOptions.context;

  const mutate = (
    mutation: DocumentNode,
    variables: any,
    options: MutationOptions = {}
  ) => client.mutate({ mutation, variables, ...options, ...globalOptions });

  const query = (query: DocumentNode, variables: any) =>
    client.query({ query, variables, ...globalOptions });

  return { mutate, query };
};
