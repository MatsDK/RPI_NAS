import { Datastore, useGetDataStoresQuery } from "generated/apolloComponents";
import Link from "next/link";
import React, { useState } from "react";
import NewDataStoreWrapper from "./NewDataStoreWrapper";
import ShareDataStoreWrapper from "./ShareDataStoreWrapper";
import { useApolloClient } from "react-apollo";
import { useMeState } from "src/hooks/useMeState";

const DataStoresContainer: React.FC = () => {
  const { me } = useMeState();

  const client: any = useApolloClient();
  const { loading, data, error } = useGetDataStoresQuery({ client });

  const [showNewDataStoreForm, setShowNewDataStoreForm] = useState(false);
  const [showShareDataStoreForm, setShowShareDataStoreForm] = useState(false);

  const [dataStoreId, setDataStoreId] = useState(0);

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
      {showShareDataStoreForm && (
        <ShareDataStoreWrapper
          dataStoreId={dataStoreId}
          dataStores={
            (data?.getDataStores as Datastore[]).filter(
              (d) => d.userId == me.id
            ) || null
          }
          hide={() => setShowShareDataStoreForm(false)}
        />
      )}
      {me?.isAdmin && (
        <button onClick={() => setShowNewDataStoreForm((show) => !show)}>
          create datastore
        </button>
      )}
      {data?.getDataStores?.map((dataStore, idx) => {
        const isDataStoreOwner = dataStore.owner?.id == me?.id;

        return (
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
              <div>
                {isDataStoreOwner && (
                  <button
                    onClick={() => {
                      setDataStoreId(Number(dataStore.id));
                      setShowShareDataStoreForm((s) => !s);
                    }}
                  >
                    share datastore
                  </button>
                )}
                <b>SHARED {dataStore.sharedUsers.length}</b>
                {dataStore.sharedUsers.map((sharedUser, idx) => {
                  return (
                    <div key={idx}>
                      {sharedUser.userName}
                      {sharedUser.id === me?.id && " YOU"}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DataStoresContainer;
