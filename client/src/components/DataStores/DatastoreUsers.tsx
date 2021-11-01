import {
  Datastore,
  useGetFriendsQueryQuery,
  User,
} from "generated/apolloComponents";
import { ProfilePicture } from "src/ui/ProfilePicture";
import React, { useState } from "react";
import { useApolloClient } from "react-apollo";
import { useMeState } from "src/hooks/useMeState";

interface DatastoreUsersProps {
  updatedDatastore: Datastore | null;
  setUpdatedDatastore: React.Dispatch<React.SetStateAction<Datastore | null>>;
  isDatastoreOwner: boolean;
}

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

  return (
    <div>
      {(isDatastoreOwner
        ? updatedDatastore?.sharedUsers
        : updatedDatastore?.sharedUsers.filter(({ id }) => id != me?.id)
      )?.map((sharedUser) => (
        <div key={sharedUser.id}>
          <ProfilePicture
            src={`${process.env.NEXT_PUBLIC_SERVER_URL}/profile/${sharedUser.id}`}
          />
          {sharedUser.userName}
          {isDatastoreOwner && (
            <>
              <button
                onClick={() => {
                  updatedDatastore!.sharedUsers =
                    updatedDatastore!.sharedUsers?.filter(
                      (u) => u.id != sharedUser.id
                    );

                  setUpdatedDatastore(() => ({ ...updatedDatastore } as any));
                }}
              >
                remove
              </button>
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
              SMB allowed
            </>
          )}
        </div>
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
