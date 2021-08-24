import { ApolloClient, NormalizedCacheObject } from "apollo-boost";
import { getDirectoryTreeQuery } from "graphql/TreeObject/queryDirectoryTree";
import Tree from "lib/components/Tree";

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
