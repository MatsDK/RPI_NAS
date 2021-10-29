import { getDatastoreQuery } from "graphql/DataStores/getDatastore";
import { ToggleDatastoreServiceMutation } from "graphql/DataStores/toggleDatastoreService";
import { useRouter } from "next/router";
import React from "react";
import { useApolloClient } from "react-apollo";
import { useApollo } from "src/hooks/useApollo";
import {
  Datastore,
  useGetDatastoreQuery,
} from "../../../generated/apolloComponents";

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
    await mutate(
      ToggleDatastoreServiceMutation,
      {
        serviceName: "SMB",
        datastoreId,
      },
      {
        refetchQueries: [
          { query: getDatastoreQuery, variables: { datastoreId } },
        ],
      }
    );
  };

  if (loading) return <div>loading</div>;
  if (error) console.log(error);

  return (
    <div>
      {ds.name}
      <button onClick={toggleDatastoreSmbEnabled}>
        {ds.owner?.smbEnabled ? "disable" : "enable"}
      </button>
    </div>
  );
};
