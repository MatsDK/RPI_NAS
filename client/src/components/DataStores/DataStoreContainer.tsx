import {
  Datastore,
  useGetDatastoreQuery,
} from "../../../generated/apolloComponents";
import { useRouter } from "next/router";
import React from "react";
import { useApolloClient } from "react-apollo";
import { useApollo } from "src/hooks/useApollo";
import { ToggleDatastoreServiceMutation } from "graphql/DataStores/toggleDatastoreService";

interface DataStoreContainerProps {}

export const DataStoreContainer: React.FC<DataStoreContainerProps> = ({}) => {
  const router = useRouter();
  const client: any = useApolloClient();
  const { mutate } = useApollo();

  const datastoreId = Number(router.query.id);
  const { data, loading, error } = useGetDatastoreQuery({
    variables: { datastoreId },
    client,
  });

  const ds: Datastore = data?.getDatastore as any;
  if (!ds) return null;

  const toggleDatastoreSmbEnabled = async () => {
    const res = await mutate(ToggleDatastoreServiceMutation, {
      serviceName: "SMB",
      datastoreId,
    });

    console.log(res);
  };

  if (loading) return <div>loading</div>;
  if (error) console.log(error);

  return (
    <div>
      {ds.name}
      <button onClick={toggleDatastoreSmbEnabled}>toggle</button>
    </div>
  );
};
