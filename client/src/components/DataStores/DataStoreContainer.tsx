import { getDatastoreQuery } from "graphql/DataStores/getDatastore";
import { InitializeUserForm } from "./InitializeUserForm";
import { ToggleDatastoreServiceMutation } from "graphql/DataStores/toggleDatastoreService";
import { UpdateDatastoreMutation } from "graphql/DataStores/updateDatastore";
import React, { useEffect, useState } from "react";
import { useApollo } from "src/hooks/useApollo";
import { useMeState } from "src/hooks/useMeState";
import { ConditionOverlay } from "../ConditionOverlay";
import { Scrollbar } from "src/ui/Scrollbar";
import styled from "styled-components";
import { Datastore } from "../../../generated/apolloComponents";
import { DatastoreInfo } from "./DatastoreInfo";
import { DatastoreUsersWrapper } from "./DatastoreUsersWrapper";
import { UpdateChanged } from "./UpdateChanged";
import { datastoreUpdated, getUpdateObj } from "./updateDatastore";

interface DataStoreContainerProps {
  ds: Datastore | undefined
  datastoreId: number
}

const DatastoreContainerWrapper = styled.div`
  ${Scrollbar}

  flex: 1;
  padding: 20px 30px 70px 30px;
  overflow: auto;
`;

const DatastoreName = styled.h1`
  color: ${(props) => props.theme.textColors[0]};
  font-size: 35px;
  font-weight: 500;

  span {
    font-size: 18px;
    font-weight: normal;
    margin-left: 10px;
    color: ${(props) => props.theme.textColors[2]};
  }
`;

export const UserWrapper = styled.div`
  padding: 4px 0;
  display: flex;
  align-items: center;

  p {
    margin-left: 10px;
    flex: 1;
    color: ${(props) => props.theme.textColors[0]};

    span {
      color: ${(props) => props.theme.textColors[2]};
      margin-left: 2px;
    }
  }
`;

export const UserWrapperLeft = styled.div`
  min-width: 60%;
  padding: 0;
  display: flex;
  align-items: center;
  margin: 0;

  :hover > div > button {
    opacity: 1;
  }

  > div {
    width: 25px;

    > button {
      transition: 0.1s ease-in-out;
      opacity: 0;
      border: 0;
      outline: none;
      margin-top: 2px;
      cursor: pointer;
      background-color: transparent;
    }
  }
`;

export const DataStoreContainer: React.FC<DataStoreContainerProps> = ({ ds, datastoreId }) => {
  const { me } = useMeState();
  const { mutate } = useApollo();

  const [hasChanged, setHasChanged] = useState(false);
  const [smbEnabled, setSmbEnabled] = useState(false);
  const [updatedDatastore, setUpdatedDatastore] = useState<Datastore | null>({
    ...ds,
  } as any);


  useEffect(() => {
    setHasChanged(datastoreUpdated(ds as Datastore | null, updatedDatastore));

    return () => { };
  }, [updatedDatastore]);

  useEffect(() => {
    setUpdatedDatastore({ ...ds } as any);

    return () => { };
  }, [ds]);

  useEffect(() => {
    setHasChanged(defaultSMBEnabled != smbEnabled);
  }, [smbEnabled]);

  useEffect(() => {
    setSmbEnabled(!!ds?.sharedUsers.find(({ id }) => id == me?.id)?.smbEnabled);
  }, [ds, me]);

  if (!ds) return null;

  const update = async () => {
    if (!hasChanged) return;

    if (isDatastoreOwner) {
      const { data, errors } = await mutate(
        UpdateDatastoreMutation,
        {
          datastoreId,
          ...getUpdateObj(ds as Datastore | null, updatedDatastore),
        },
        {
          refetchQueries: [
            { query: getDatastoreQuery, variables: { datastoreId } },
          ],
        }
      );

      console.log(data, errors);
    } else {
      const { data, errors } = await mutate(
        ToggleDatastoreServiceMutation,
        {
          datastoreId,
          serviceName: "SMB",
        },
        {
          refetchQueries: [
            { query: getDatastoreQuery, variables: { datastoreId } },
          ],
        }
      );

      console.log(data, errors);
    }
  };

  const isDatastoreOwner = me?.id === ds.owner?.id,
    defaultSMBEnabled = !!ds?.sharedUsers.find(({ id }) => id == me?.id)
      ?.smbEnabled;

  return (
    <DatastoreContainerWrapper>
      <ConditionOverlay condition={!ds.userInitialized} renderOverlay={
        () => <InitializeUserForm datastore={ds} />}
      >
        <DatastoreName>
          {ds.name}
          {ds.sharedUsers.length ? <span>Shared</span> : null}
        </DatastoreName>
        <DatastoreInfo datastore={ds as any} />
        <DatastoreUsersWrapper
          datastore={ds as any}
          updatedDatastore={updatedDatastore}
          setUpdatedDatastore={setUpdatedDatastore}
          smbEnabled={smbEnabled}
          setSmbEnabled={setSmbEnabled}
        />
        <div>
          {hasChanged && (
            <UpdateChanged
              updated={[
                {
                  title: ds.name,
                  onUpdate: update,
                  onCancel: () => {
                    setUpdatedDatastore(() => ({ ...ds } as any));
                    setHasChanged(false);
                    setSmbEnabled(defaultSMBEnabled);
                  },
                },
              ]}
            />
          )}
        </div>
      </ConditionOverlay>

    </DatastoreContainerWrapper>
  );
};
