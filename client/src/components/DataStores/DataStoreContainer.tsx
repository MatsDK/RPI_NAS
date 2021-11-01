import { ProfilePicture } from "src/ui/ProfilePicture";
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
  padding: 20px 30px;
`;

const DatastoreName = styled.h1`
  color: ${(props) => props.theme.textColors[0]};
  font-size: 40px;
  font-weight: 700;

  span {
    font-size: 18px;
    font-weight: normal;
    margin-left: 10px;
    color: ${(props) => props.theme.textColors[2]};
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

  if (loading) return <div>loading</div>;
  if (error) console.log(error);

  const isDatastoreOwner = me?.id === ds.owner?.id,
    defaultSMBEnabled = !!updatedDatastore?.sharedUsers.find(
      ({ id }) => id == me?.id
    )?.smbEnabled;

  console.log(me, updatedDatastore);
  return (
    <DatastoreContainerWrapper>
      <DatastoreName>
        {ds.name}
        {ds.sharedUsers.length ? <span>Shared</span> : null}
      </DatastoreName>
      <div>
        Users:
        <div>
          {!isDatastoreOwner && (
            <div>
              <ProfilePicture
                src={`${process.env.NEXT_PUBLIC_SERVER_URL}/profile/${me?.id}`}
              />
              {me?.userName}(You)
              {updatedDatastore?.allowedSMBUsers?.includes(Number(me?.id)) && (
                <>
                  <input
                    type="checkbox"
                    defaultChecked={defaultSMBEnabled}
                    onChange={(e) => setSmbEnabled(e.target.checked)}
                  />
                  SMB enabled
                </>
              )}
            </div>
          )}
          <div>
            <ProfilePicture
              src={`${process.env.NEXT_PUBLIC_SERVER_URL}/profile/${ds.owner?.id}`}
            />
            {ds.owner?.userName}
            (Owner)
            {me?.id == ds.owner?.id && "(You)"}
            {isDatastoreOwner && (
              <button
                onClick={() =>
                  setUpdatedDatastore(
                    (uds) =>
                      ({
                        ...uds,
                        owner: {
                          ...uds?.owner,
                          smbEnabled: !uds?.owner?.smbEnabled,
                        },
                      } as any)
                  )
                }
              >
                {updatedDatastore?.owner?.smbEnabled ? "disable" : "enable"}
              </button>
            )}
          </div>
        </div>
        <DatastoreUsers
          setUpdatedDatastore={setUpdatedDatastore}
          updatedDatastore={updatedDatastore}
          isDatastoreOwner={isDatastoreOwner}
        />
      </div>
      <div>{hasChanged && <button onClick={update}>update</button>}</div>
    </DatastoreContainerWrapper>
  );
};
