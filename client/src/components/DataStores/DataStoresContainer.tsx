import { Datastore, useGetDataStoresQuery } from "generated/apolloComponents";
import { BgButton } from "src/ui/Button";
import React, { useState } from "react";
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
  font-weight: 500;
  font-size: 25px;
  color: ${(props) => props.theme.bgColors[0]};
  display: flex;
  align-items: baseline;

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
          Datastores
          <span>
            <p>{data?.getDataStores?.length}</p> Datastores
          </span>
        </DataStoresTitle>
        {me?.isAdmin && (
          <BgButton onClick={() => setShowNewDataStoreForm((show) => !show)}>
            Create Datastore
          </BgButton>
        )}
      </DataStoresHeader>
      <DataStoresList>
        {data?.getDataStores?.map((dataStore, idx) => {
          return (
            <DataStoreListItem
              dataStore={dataStore as any}
              setDataStoreId={setDataStoreId}
              setShowShareDataStoreForm={setShowShareDataStoreForm}
              key={idx}
            />
          );
        })}
      </DataStoresList>
    </DataStoresWrapper>
  );
};

export default DataStoresContainer;
