import { ApolloClient, NormalizedCacheObject } from "apollo-boost";
import { getTreeQuery } from "graphql/TreeObject/queryTree";
import React from "react";

type Maybe<T> = T | null;

interface Props {
  tree: Maybe<{ [key: string]: any }>;
}

interface NextFunctionComponent<Props> extends React.FC<Props> {
  getInitialProps?: any;
}

interface ApolloContext {
  apolloClient: ApolloClient<NormalizedCacheObject>;
}

const Index: NextFunctionComponent<Props> = ({ tree }) => {
  console.log(tree);
  return <div> test</div>;
};

Index.getInitialProps = async (ctx: ApolloContext) => {
  const { loading, data } = await ctx.apolloClient.query({
    query: getTreeQuery,
    variables: {
      depth: 1,
      path: "H:/js-py",
    },
  });

  if (loading) return { tree: null };

  return { tree: data.tree };
};

export default Index;
