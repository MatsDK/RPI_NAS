import { ProfilePicture } from "src/ui/ProfilePicture";
import { UpdateChanged } from "./UpdateChanged";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useApolloClient } from "react-apollo";
import { useMeState } from "src/hooks/useMeState";
import {
  Datastore,
  useGetDatastoreQuery,
} from "../../../generated/apolloComponents";
import { useApollo } from "src/hooks/useApollo";
import { UpdateDatastoreMutation } from "graphql/DataStores/updateDatastore";
import { getDatastoreQuery } from "graphql/DataStores/getDatastore";
import styled from "styled-components";
import { DatastoreUsers } from "./DatastoreUsers";
import { datastoreUpdated, getUpdateObj } from "./updateDatastore";
import { ToggleDatastoreServiceMutation } from "graphql/DataStores/toggleDatastoreService";

interface DataStoreContainerProps {}

const DatastoreContainerWrapper = styled.div`
  flex: 1;
  padding: 20px 30px;
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

const SmallTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: ${(props) => props.theme.textColors[0]};
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

const Headers = styled.div`
  display: flex;
  align-items: baseline;
  width: 100%;
  margin: 10px 0;

  h3 {
    min-width: 60%;
  }

  span {
    color: ${(props) => props.theme.textColors[1]};
    font-size: 16px;
  }
`;

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
  const ds = data?.getDatastore;

  const [hasChanged, setHasChanged] = useState(false);
  const [smbEnabled, setSmbEnabled] = useState(false);
  const [updatedDatastore, setUpdatedDatastore] = useState<Datastore | null>({
    ...ds,
  } as any);

  useEffect(() => {
    setHasChanged(datastoreUpdated(ds as Datastore | null, updatedDatastore));

    return () => {};
  }, [updatedDatastore]);

  useEffect(() => {
    setUpdatedDatastore({ ...ds } as any);

    return () => {};
  }, [ds]);

  useEffect(() => {
    setHasChanged(defaultSMBEnabled != smbEnabled);
  }, [smbEnabled]);

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
    defaultSMBEnabled = !!updatedDatastore?.sharedUsers.find(
      ({ id }) => id == me?.id
    )?.smbEnabled;

  // useEffect(() => {
  //   setSmbEnabled(defaultSMBEnabled);
  // }, [defaultSMBEnabled]);

  if (loading) return <div>loading</div>;
  if (error) console.log(error);

  return (
    <DatastoreContainerWrapper>
      <DatastoreName>
        {ds.name}
        {ds.sharedUsers.length ? <span>Shared</span> : null}
      </DatastoreName>
      <div>
        <Headers>
          <SmallTitle>Users</SmallTitle>
          <span>SMB enabled</span>
        </Headers>
        <div>
          {!isDatastoreOwner && (
            <UserWrapper>
              <UserWrapperLeft>
                <div></div>
                <ProfilePicture
                  src={`${process.env.NEXT_PUBLIC_SERVER_URL}/profile/${me?.id}`}
                />
                <p>
                  {me?.userName}
                  <span>(You)</span>
                </p>
              </UserWrapperLeft>
              {updatedDatastore?.allowedSMBUsers?.includes(Number(me?.id)) && (
                <>
                  <input
                    type="checkbox"
                    checked={defaultSMBEnabled}
                    onChange={(e) => setSmbEnabled(e.target.checked)}
                  />
                </>
              )}
            </UserWrapper>
          )}
          <UserWrapper>
            <UserWrapperLeft>
              <div></div>
              <ProfilePicture
                src={`${process.env.NEXT_PUBLIC_SERVER_URL}/profile/${ds.owner?.id}`}
              />
              <p>
                {ds.owner?.userName}
                <span>
                  (Owner)
                  {me?.id == ds.owner?.id && "(You)"}
                </span>
              </p>
            </UserWrapperLeft>
            {isDatastoreOwner && (
              <input
                type="checkbox"
                onClick={() =>
                  setUpdatedDatastore((uds) => {
                    const newObj = { ...uds, owner: { ...uds?.owner } };
                    newObj?.owner?.smbEnabled != null &&
                      (newObj.owner.smbEnabled = !newObj?.owner?.smbEnabled);

                    return { ...newObj } as any;
                  })
                }
                checked={!!updatedDatastore?.owner?.smbEnabled}
              />
            )}
          </UserWrapper>
        </div>
        <DatastoreUsers
          setUpdatedDatastore={setUpdatedDatastore}
          updatedDatastore={updatedDatastore}
          isDatastoreOwner={isDatastoreOwner}
        />
      </div>
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
    </DatastoreContainerWrapper>
  );
};
