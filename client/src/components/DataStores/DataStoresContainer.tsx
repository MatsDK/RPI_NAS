import { Datastore, useGetDataStoresQuery } from "generated/apolloComponents";
import { BgButton } from "src/ui/Button";
import Link from "next/link";
import React, { useState } from "react";
import NewDataStoreWrapper from "./NewDataStoreWrapper";
import ShareDataStoreWrapper from "./ShareDataStoreWrapper";
import { useApolloClient } from "react-apollo";
import { useMeState } from "src/hooks/useMeState";
import styled from "styled-components";
import { Scrollbar } from "src/ui/Scrollbar";

const DataStoresWrapper = styled.div`
  padding: 25px 0 0 30px;
  min-width: 460px;
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

const DataStoreShared = styled.div`
  display: flex;
  flex-direction: column;
`;

const DataStoreSharedHeader = styled.div`
  display: flex;
  align-items: baseline;
  margin-top: 5px;

  button {
    margin-left: 15px;
    background-color: transparent;
    border: 0;
    color: ${(props) => props.theme.textColors[2]};
    transition: 0.1s ease-in-out;
    cursor: pointer;
    font-size: 15px;

    :hover {
      color: ${(props) => props.theme.textColors[1]};
    }
  }

  > div {
    display: flex;
    align-items: baseline;
    font-size: 17px;
    color: ${(props) => props.theme.textColors[0]};

    p {
      font-size: 14px;
      margin-left: 3px;
      color: ${(props) => props.theme.textColors[2]};
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

const DataStoreItem = styled.div`
  padding: 15px;
  border-bottom: 1px solid ${(props) => props.theme.textColors[3]};
`;

const DataStoreItemHeader = styled.div`
  display: flex;
  align-items: center;
  margin: 0 0 5px 0;
  justify-content: space-between;
`;

const DataStoreOwner = styled.div`
  display: flex;

  label {
    color: ${(props) => props.theme.textColors[2]};
    margin-right: 3px;
  }

  span {
    color: ${(props) => props.theme.textColors[0]};
    font-weight: 500;
  }

  p {
    color: ${(props) => props.theme.textColors[2]};
    font-weight: 500;
    margin-left: 3px;
  }
`;

const DataStoreItemTitle = styled.div`
  font-weight: 600;
  font-size: 20px;
  color: ${(props) => props.theme.textColors[0]};

  button {
    background-color: transparent;
    border: 0;
    color: ${(props) => props.theme.textColors[2]};
    font-size: 14px;
    margin-left: 4px;
    cursor: pointer;
  }
`;

const DataStoreSharedUsers = styled.div`
  display: flex;
  align-items: center;

  > div {
    margin: 0 6px;
    display: flex;
    margin-top: 5px;

    p {
      color: ${(props) => props.theme.textColors[2]};
    }
  }
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
          const isDataStoreOwner = dataStore.owner?.id == me?.id;

          return (
            <DataStoreItem key={idx}>
              <DataStoreItemHeader>
                <DataStoreItemTitle>
                  <span>{dataStore.name}</span>
                  <Link href={`/path?d=${dataStore.id}`}>
                    <button>Go to</button>
                  </Link>
                </DataStoreItemTitle>
                <DataStoreOwner>
                  <label>Owner: </label>
                  <span>{dataStore.owner?.userName}</span>
                  <p>{dataStore.owner?.id === me?.id && " (You)"}</p>
                </DataStoreOwner>
              </DataStoreItemHeader>
              <DataStoreShared>
                <DataStoreSharedHeader>
                  <div>
                    Shared
                    <p>
                      {dataStore.sharedUsers.length}{" "}
                      {dataStore.sharedUsers.length == 1 ? "person" : "people"}
                    </p>
                  </div>
                  {isDataStoreOwner && (
                    <button
                      onClick={() => {
                        setDataStoreId(Number(dataStore.id));
                        setShowShareDataStoreForm((s) => !s);
                      }}
                    >
                      Share
                    </button>
                  )}
                </DataStoreSharedHeader>
                <DataStoreSharedUsers>
                  {dataStore.sharedUsers.map((sharedUser, idx) => {
                    return (
                      <div key={idx}>
                        {sharedUser.userName}
                        <p>{sharedUser.id === me?.id && "(You)"}</p>
                      </div>
                    );
                  })}
                </DataStoreSharedUsers>
              </DataStoreShared>
            </DataStoreItem>
          );
        })}
      </DataStoresList>
    </DataStoresWrapper>
  );
};

export default DataStoresContainer;
