import { getDirectoryTreeQuery } from "graphql/TreeObject/queryDirectoryTree";
import Tree from "src/components/Tree/Tree";
import { withAuth } from "src/HOC/withAuth";
import { useMeState } from "src/hooks/useMeState";
import {
  ApolloContext,
  Maybe,
  NextFunctionComponentWithAuth,
} from "types/types";
import { Layout } from "../src/components/Layout";
import SideBar from "../src/components/SideBar";

interface Props {
  tree: Maybe<{ [key: string]: any }>;
}

const Page: NextFunctionComponentWithAuth<Props> = ({ me }) => {
  useMeState(me);

  return (
    <Layout title="Home">
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
      datastoreId: null,
    },
  });

  if (loading) return { tree: null };

  return { tree: data.tree };
};

export default withAuth(Page);
