import { useGetDataStoresQuery } from "generated/apolloComponents";
import Link from "next/link";
import React, { useState } from "react";
import NewDataStoreWrapper from "./NewDataStoreWrapper";
import { useApolloClient } from "react-apollo";
import { useMeState } from "src/hooks/useMeState";

const DataStoresContainer: React.FC = () => {
  const { me } = useMeState();

  const client: any = useApolloClient();
  const { loading, data, error } = useGetDataStoresQuery({ client });

  const [showNewDataStoreForm, setShowNewDataStoreForm] = useState(false);

  if (loading) return <div>Loading</div>;

  if (error) {
    console.log(error);

    return null;
  }

  return (
    <div>
      {showNewDataStoreForm && (
        <NewDataStoreWrapper hide={() => setShowNewDataStoreForm(false)} />
      )}
      {me?.isAdmin && (
        <button onClick={() => setShowNewDataStoreForm((show) => !show)}>
          create datastore
        </button>
      )}
      {data?.getDataStores?.map((dataStore, idx) => (
        <div key={idx} style={{ margin: 15 }}>
          <span>{dataStore.name}</span>
          <Link href={`/path?d=${dataStore.id}`}>
            <div>{dataStore.basePath}</div>
          </Link>
          <div>
            {dataStore.owner?.userName}
            {dataStore.owner?.isAdmin && " ADMIN"}
            {dataStore.owner?.id === me?.id && " YOU"}
          </div>
          <div>
            <b>SHARED {dataStore.sharedUsers.length}</b>
            <div>
              {dataStore.sharedUsers.map((sharedUser, idx) => (
                <div key={idx}>
                  {sharedUser.userName}
                  {sharedUser.id === me?.id && " YOU"}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DataStoresContainer;
