import { Layout } from "src/components/Layout";
import SideBar from "src/components/SideBar";
import { withAuth } from "src/HOC/withAuth";
import DataStoresContainer from "src/components/DataStores/DataStoresContainer";
import { ApolloContext, NextFunctionComponentWithAuth } from "types/types";
import { useMeState } from "src/hooks/useMeState";
import { DataStoreContainer } from "src/components/DataStores/DataStoreContainer";
import { getDatastoreQuery } from "graphql/DataStores/getDatastore";

const Datastores: NextFunctionComponentWithAuth = ({ me }) => {
  useMeState(me);

  return (
    <Layout>
      <SideBar />
      <DataStoresContainer />
      <DataStoreContainer />
    </Layout>
  );
};

Datastores.getInitialProps = async (ctx: ApolloContext) => {
  const id = Number(ctx.query.id);

  const { loading, data } = await ctx.apolloClient.query({
    query: getDatastoreQuery,
    variables: { datastoreId: id },
  });

  if (loading) return { dataStores: null };

  return { dataStores: data };
};

export default withAuth(Datastores);
