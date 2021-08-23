import { ApolloClient, NormalizedCacheObject } from "apollo-boost";
import { useGetTreeQueryQuery, TreeItem } from "generated/apolloComponents";
import { getTreeQuery } from "graphql/TreeObject/queryTree";
import { useApolloClient } from "react-apollo";
import TreeObjectItem from "lib/components/TreeItem";

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
  const client: any = useApolloClient();

  const { data, loading, error } = useGetTreeQueryQuery({
    client: client,
    variables: {
      depth: 1,
      path: "H:/js-py",
    },
  });

  if (loading) return <div>loading..</div>;
  if (error) return <div>errors</div>;

  if (!data?.tree?.tree) return <div>Tree not found</div>;

  return (
    <div>
      {data.tree.tree.map((item, idx) => (
        <TreeObjectItem item={item as TreeItem} key={idx} />
      ))}
    </div>
  );
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
