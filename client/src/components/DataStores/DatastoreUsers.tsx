import Icon from "../../ui/Icon";
import {
  Datastore,
  useGetFriendsQueryQuery,
  User,
} from "generated/apolloComponents";
import { ProfilePicture } from "src/ui/ProfilePicture";
import React, { useState } from "react";
import { useApolloClient } from "react-apollo";
import { useMeState } from "src/hooks/useMeState";
import { UserWrapper, UserWrapperLeft } from "./DataStoreContainer";
import styled from "styled-components";

interface DatastoreUsersProps {
  updatedDatastore: Datastore | null;
  setUpdatedDatastore: React.Dispatch<React.SetStateAction<Datastore | null>>;
  isDatastoreOwner: boolean;
}

const Divider = styled.div`
  height: 1px;
  width: 100%;
  background-color: ${(props) => props.theme.textColors[3]};
  margin: 5px 0;
`;

export const DatastoreUsers: React.FC<DatastoreUsersProps> = ({
  updatedDatastore,
  setUpdatedDatastore,
  isDatastoreOwner,
}) => {
  const client: any = useApolloClient();
  const [showAddSharedUserForm, setShowAddSharedUserForm] = useState(false);
  const { data: friendsData } = useGetFriendsQueryQuery({ client });
  const friends = friendsData?.getFriends || [];
  const { me } = useMeState();

  const sharedUsers = isDatastoreOwner
    ? updatedDatastore?.sharedUsers
    : updatedDatastore?.sharedUsers.filter(({ id }) => id != me?.id);

  return (
    <div>
      {!!sharedUsers?.length && <Divider />}
      {sharedUsers?.map((sharedUser) => (
        <UserWrapper key={sharedUser.id}>
          <UserWrapperLeft>
            <div>
              <button
                onClick={() => {
                  updatedDatastore!.sharedUsers =
                    updatedDatastore!.sharedUsers?.filter(
                      (u) => u.id != sharedUser.id
                    );

                  setUpdatedDatastore(() => ({ ...updatedDatastore } as any));
                }}
              >
                <Icon
                  name="removeIcon"
                  color={{ propName: "textColors", idx: 1 }}
                  width={20}
                  height={20}
                />
              </button>
            </div>
            <ProfilePicture
              src={`${process.env.NEXT_PUBLIC_SERVER_URL}/profile/${sharedUser.id}`}
            />
            <p>{sharedUser.userName}</p>
          </UserWrapperLeft>
          {isDatastoreOwner && (
            <>
              <input
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked)
                    updatedDatastore!.allowedSMBUsers = Array.from(
                      new Set([
                        ...(updatedDatastore!.allowedSMBUsers || []),
                        Number(sharedUser.id),
                      ])
                    );
                  else
                    updatedDatastore!.allowedSMBUsers =
                      updatedDatastore?.allowedSMBUsers?.filter(
                        (id) => id != Number(sharedUser.id)
                      ) || [];

                  setUpdatedDatastore({ ...updatedDatastore! });
                }}
                defaultChecked={
                  !!updatedDatastore?.allowedSMBUsers?.includes(
                    Number(sharedUser.id)
                  )
                }
              />
            </>
          )}
        </UserWrapper>
      ))}
      {isDatastoreOwner && (
        <button onClick={() => setShowAddSharedUserForm((s) => !s)}>
          Add shared user
        </button>
      )}
      {showAddSharedUserForm && (
        <div>
          {friends
            .filter(
              (f) => !updatedDatastore?.sharedUsers.find((u) => u.id === f.id)
            )
            .map((u) => {
              return (
                <div key={u.id}>
                  <ProfilePicture
                    src={`${process.env.NEXT_PUBLIC_SERVER_URL}/profile/${u.id}`}
                  />
                  {u.userName}
                  <button
                    onClick={() => {
                      updatedDatastore!.sharedUsers = [
                        ...(updatedDatastore?.sharedUsers || []),
                        u as User,
                      ];

                      setUpdatedDatastore(
                        () => ({ ...updatedDatastore } as any)
                      );
                    }}
                  >
                    add to shared
                  </button>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};
