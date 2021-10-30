import { getDatastoreQuery } from "graphql/DataStores/getDatastore";
import { ToggleDatastoreServiceMutation } from "graphql/DataStores/toggleDatastoreService";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useApolloClient } from "react-apollo";
import { useApollo } from "src/hooks/useApollo";
import { useMeState } from "src/hooks/useMeState";
import { useGetDatastoreQuery } from "../../../generated/apolloComponents";

interface DataStoreContainerProps {}

export const DataStoreContainer: React.FC<DataStoreContainerProps> = ({}) => {
  const router = useRouter();
  const client: any = useApolloClient();
  const { mutate } = useApollo();
  const { me } = useMeState();

  const datastoreId = Number(router.query.id);
  const { data, loading, error } = useGetDatastoreQuery({
    variables: { datastoreId },
    client,
  });
  const ds = data?.getDatastore;

  const [hasChanged, setHasChanged] = useState(false);
  const [name, setName] = useState("");
  const [ownerSMBEnabled, setOwnerSMBEnabled] = useState(false);

  useEffect(() => {
    setHasChanged(
      name !== ds?.name || ownerSMBEnabled !== ds.owner?.smbEnabled
    );

    return () => {};
  }, [name, ownerSMBEnabled]);

  useEffect(() => {
    setName(ds?.name || "");
    setOwnerSMBEnabled(ds?.owner?.smbEnabled || false);

    return () => {};
  }, [ds]);

  if (!ds) return null;

  // const toggleDatastoreSmbEnabled = async () => {
  //   await mutate(
  //     ToggleDatastoreServiceMutation,
  //     {
  //       serviceName: "SMB",
  //       datastoreId,
  //     },
  //     {
  //       refetchQueries: [
  //         { query: getDatastoreQuery, variables: { datastoreId } },
  //       ],
  //     }
  //   );
  // };

  if (loading) return <div>loading</div>;
  if (error) console.log(error);
  console.log(me);

  return (
    <div>
      Name:{" "}
      <input
        type="text"
        onChange={(e) => setName(e.target.value)}
        value={name}
      />
      <div>
        Users:
        <div>
          {ds.owner?.userName}
          {me?.id == ds.owner?.id && "(You)"}
          <button onClick={() => setOwnerSMBEnabled((e) => !e)}>
            {ownerSMBEnabled ? "disable" : "enable"}
          </button>
        </div>
        {ds.sharedUsers.map((sharedUser) => (
          <div>{sharedUser.userName}</div>
        ))}
      </div>
      <div>{hasChanged && <button>update</button>}</div>
    </div>
  );
};
