import { getDirectoryTreeQuery } from "graphql/TreeObject/queryDirectoryTree";
import Tree from "src/components/Tree/Tree";
import { NextFunctionComponent, ApolloContext, Maybe } from "types/types";
import { Layout } from "../src/components/Layout";
import SideBar from "../src/components/SideBar";

interface Props {
  tree: Maybe<{ [key: string]: any }>;
}

const Index: NextFunctionComponent<Props> = () => {
  return (
    <Layout>
      <SideBar />
      <Tree />
    </Layout>
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
