import { Layout } from "src/components/Layout";
import SideBar from "src/components/SideBar";
import { withAuth } from "src/HOC/withAuth";
import DataStoresContainer from "src/components/DataStores/DatastoresContainer";
import { ApolloContext, NextFunctionComponentWithAuth } from "types/types";
import { useMeState } from "src/hooks/useMeState";
import { DataStoreContainer } from "src/components/DataStores/DatastoreContainer";
import { getDatastoreQuery } from "graphql/DataStores/getDatastore";
import { Datastore, useGetDatastoreQuery } from "generated/apolloComponents";
import { useRouter } from "next/router";
import { useApolloClient } from "react-apollo";

const Datastores: NextFunctionComponentWithAuth = ({ me }) => {
  const router = useRouter();
  const client = useApolloClient() as any
  useMeState(me);

  const datastoreId = Number(router.query.id);
  const { data } = useGetDatastoreQuery({
    variables: { datastoreId },
    client,
  });

  const ds = data?.getDatastore;

  return (
    <Layout title={`${ds ? `${ds.name} | ` : ""}Datastores`}>
      <SideBar />
      <DataStoresContainer />
      <DataStoreContainer ds={ds as Datastore} datastoreId={datastoreId} />
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
