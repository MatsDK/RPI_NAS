import {
  Datastore,
  useGetDatastoreQuery,
} from "../../../generated/apolloComponents";
import { useRouter } from "next/router";
import React from "react";
import { useApolloClient } from "react-apollo";
import { useMeState } from "src/hooks/useMeState";
import { useApollo } from "src/hooks/useApollo";
import { ToggleServiceMutation } from "graphql/User/toggleService";
import { ToggleDatastoreServiceMutation } from "graphql/DataStores/toggleDatastoreService";

interface DataStoreContainerProps {}

export const DataStoreContainer: React.FC<DataStoreContainerProps> = ({}) => {
  const router = useRouter();
  const client: any = useApolloClient();
  const { me } = useMeState();
  const { mutate } = useApollo();

  const datastoreId = Number(router.query.id);
  const { data, loading, error } = useGetDatastoreQuery({
    variables: { datastoreId },
    client,
  });

  const ds: Datastore = data?.getDatastore as any;
  if (!ds) return null;

  const toggleSmbEnabled = async () => {
    const res = await mutate(ToggleServiceMutation, { serviceName: "SMB" });
    console.log(res);
  };

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
      <button onClick={toggleSmbEnabled}>
        {me?.smbEnabled ? "disable" : "enable"}
      </button>
      {ds.name}
      <button onClick={toggleDatastoreSmbEnabled}>
        {ds.smbEnabled ? "disable" : "enable"}
      </button>
    </div>
  );
};
