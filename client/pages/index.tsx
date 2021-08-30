import { getDirectoryTreeQuery } from "graphql/TreeObject/queryDirectoryTree";
import Tree from "lib/components/Tree/Tree";
import { NextFunctionComponent, ApolloContext, Maybe } from "types/types";

interface Props {
  tree: Maybe<{ [key: string]: any }>;
}

const Index: NextFunctionComponent<Props> = () => {
  return (
    <div>
      <Tree />
    </div>
  );
};

Index.getInitialProps = async (ctx: ApolloContext) => {
  const { loading, data } = await ctx.apolloClient.query({
    query: getDirectoryTreeQuery,
    variables: {
      depth: 1,
      path: "/",
    },
  });

  if (loading) return { tree: null };

  return { tree: data.tree };
};

export default Index;
