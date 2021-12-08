import { Datastore, useGetDataStoresQuery } from "generated/apolloComponents";
import Link from "next/link";
import { BgButton } from "src/ui/Button";
import React, { useEffect, useState } from "react";
import NewDataStoreWrapper from "./NewDataStoreWrapper";
import ShareDataStoreWrapper from "./ShareDataStoreWrapper";
import { useApolloClient } from "react-apollo";
import { useMeState } from "src/hooks/useMeState";
import styled from "styled-components";
import { Scrollbar } from "src/ui/Scrollbar";
import { DataStoreListItem } from "./DataStoreListItem";

const DataStoresWrapper = styled.div`
  padding: 25px 0 0 30px;
  min-width: 620px;
`;

const DataStoresList = styled.div`
  overflow: auto;
  height: calc(100% - 115px);

  ${Scrollbar}
`;

const DataStoresTitle = styled.h2`
  display: flex;
  align-items: baseline;

  > p {
    font-weight: 500;
    cursor: pointer;
    font-size: 25px;
    color: ${(props) => props.theme.bgColors[0]};
  }

  span {
    margin-left: 5px;
    display: flex;
    font-size: 14px;
    color: ${(props) => props.theme.textColors[2]};
    font-weight: normal;

    p {
      font-weight: 500;
      margin-right: 3px;
    }
  }
`;

const DataStoresHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 15px;
  border-bottom: 1px solid ${(props) => props.theme.textColors[3]};
`;

const SmallTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  margin: 10px 0;
`;

const DataStoresContainer: React.FC = () => {
  const { me } = useMeState();

  const client: any = useApolloClient();
  const { loading, data, error } = useGetDataStoresQuery({ client });

  const [showNewDataStoreForm, setShowNewDataStoreForm] = useState(false);
  const [showShareDataStoreForm, setShowShareDataStoreForm] = useState(false);

  const [myDatastores, setMyDatastores] = useState<Datastore[]>([]);
  const [otherDatastores, setOthersDatastores] = useState<Datastore[]>([]);

  const [dataStoreId, setDataStoreId] = useState(0);

  useEffect(() => {
    setOthersDatastores(
      (data?.getDataStores?.filter(
        (d) =>
          d.owner?.id !== me?.id &&
          !d.sharedUsers.find((su) => su.id === me?.id)
      ) || []) as any
    );
    setMyDatastores(
      (data?.getDataStores?.filter(
        (d) =>
          d.owner?.id === me?.id || d.sharedUsers.find((su) => su.id === me?.id)
      ) || []) as any
    );
    return () => {};
  }, [me, data]);

  if (error) {
    console.log(error);

    return null;
  }

  return (
    <DataStoresWrapper>
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
      <DataStoresHeader>
        <DataStoresTitle>
          <Link href="/datastore">
            <p>Datastores</p>
          </Link>
          {!loading && (
            <span>
              <p>{data?.getDataStores?.length}</p> Datastore
              {data?.getDataStores?.length === 1 ? "" : "s"}
            </span>
          )}
        </DataStoresTitle>
        {me?.isAdmin && (
          <BgButton onClick={() => setShowNewDataStoreForm((show) => !show)}>
            Create Datastore
          </BgButton>
        )}
      </DataStoresHeader>
      {!loading && (
        <DataStoresList>
          {myDatastores.map((dataStore, idx) => {
            return (
              <DataStoreListItem
                dataStore={dataStore as any}
                setDataStoreId={setDataStoreId}
                setShowShareDataStoreForm={setShowShareDataStoreForm}
                key={idx}
              />
            );
          })}
          {me?.isAdmin && !!otherDatastores.length && (
            <>
              <SmallTitle>Other datastores</SmallTitle>
              {otherDatastores.map((dataStore, idx) => {
                return (
                  <DataStoreListItem
                    showGoToBtn={false}
                    dataStore={dataStore as any}
                    setDataStoreId={setDataStoreId}
                    setShowShareDataStoreForm={setShowShareDataStoreForm}
                    key={idx}
                  />
                );
              })}
            </>
          )}
        </DataStoresList>
      )}
    </DataStoresWrapper>
  );
};

export default DataStoresContainer;
