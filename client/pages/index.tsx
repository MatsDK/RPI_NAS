import { getDirectoryTreeQuery } from "graphql/TreeObject/queryDirectoryTree";
import Tree from "src/components/Tree/Tree";
import { withAuth } from "src/HOC/withAuth";
import { ApolloContext, Maybe, NextFunctionComponent } from "types/types";
import { Layout } from "../src/components/Layout";
import SideBar from "../src/components/SideBar";

interface Props {
  tree: Maybe<{ [key: string]: any }>;
  me?: { userName: string; id: number; email: string };
}

const Page: NextFunctionComponent<Props> = ({ me }) => {
  return (
    <Layout>
      <SideBar />
      <Tree />
    </Layout>
  );
};

Page.getInitialProps = async (ctx: ApolloContext) => {
  const { loading, data } = await ctx.apolloClient.query({
    query: getDirectoryTreeQuery,
    variables: {
      depth: 1,
      path: "/",
      dataStoreId: null,
    },
  });

  if (loading) return { tree: null };

  return { tree: data.tree };
};

export default withAuth(Page);
