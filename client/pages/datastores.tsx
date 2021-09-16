import { Layout } from "src/components/Layout";
import SideBar from "src/components/SideBar";
import { withAuth } from "src/HOC/withAuth";
import DataStoresContainer from "src/components/DataStores/DataStoresContainer";
import { ApolloContext, NextFunctionComponentWithAuth } from "types/types";
import { useMeState } from "src/hooks/useMeState";
import { getDataStoresQuery } from "graphql/DataStores/getDataStores";

const Datastores: NextFunctionComponentWithAuth = ({ me }) => {
  useMeState(me);

  return (
    <Layout>
      <SideBar />
      <DataStoresContainer />
    </Layout>
  );
};

Datastores.getInitialProps = async (ctx: ApolloContext) => {
  const { loading, data } = await ctx.apolloClient.query({
    query: getDataStoresQuery,
  });

  if (loading) return { dataStores: null };

  return { dataStores: data };
};
export default withAuth(Datastores);
