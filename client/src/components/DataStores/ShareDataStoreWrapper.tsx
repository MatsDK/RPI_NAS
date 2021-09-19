import { Datastore, useGetFriendsQueryQuery } from "generated/apolloComponents";
import { CreateSharedDataStoreMutation } from "graphql/DataStores/createSharedDataStore";
import { useState } from "react";
import { useApolloClient } from "react-apollo";
import MenuOverlay from "../MenuOverlay";

interface Props {
  dataStoreId: number;
  hide: () => any;
  dataStores: null | Datastore[];
}

const ShareDataStoreWrapper: React.FC<Props> = ({
  hide,
  dataStoreId,
  dataStores,
}) => {
  const client: any = useApolloClient();

  const {
    data: friends,
    error: friendsError,
    loading: friendsLoading,
  } = useGetFriendsQueryQuery({ client });

  // const {
  //   data: dataStores,
  //   error: dataStoresError,
  //   loading: dataStoresLoading,
  // } = useGetMyDataStoresQuery({ client });

  const [selectedUsers, setSelectedUsers] = useState<Set<number>>(new Set());
  const [selectedDataStores, setSelectedDataStores] = useState<Set<number>>(
    new Set([dataStoreId])
  );

  if (friendsError) {
    console.log(friendsError);
    return <div>errors</div>;
  }

  const share = async () => {
    if (!selectedUsers.size) return alert("you haven't selected any friends");

    if (!selectedDataStores.size)
      return alert("you haven't selected any dataStores to share");

    const sharedDataStores: { dataStoreId: number; userId: number }[] = [];

    for (const id of Array.from(selectedDataStores)) {
      for (const userId of Array.from(selectedUsers)) {
        const thisDataStore = dataStores?.find((ds) => Number(ds.id) == id);

        if (
          thisDataStore &&
          !thisDataStore.sharedUsers.find((su) => Number(su.id) == userId)
        )
          sharedDataStores.push({ dataStoreId: id, userId });
      }
    }

    if (!sharedDataStores.length) return;

    const res = await client.mutate({
      mutation: CreateSharedDataStoreMutation,
      variables: {
        ids: sharedDataStores,
      },
    });

    console.log(res);
  };

  return (
    <MenuOverlay hide={hide}>
      <b>friends</b>
      {!friendsLoading &&
        friends?.friends.map((friend, idx) => (
          <div key={idx}>
            {friend.userName}
            {selectedUsers.has(Number(friend.id)) ? (
              <button
                onClick={() => {
                  selectedUsers.delete(Number(friend.id));
                  setSelectedUsers(() => new Set(selectedUsers));
                }}
              >
                remove
              </button>
            ) : (
              <button
                onClick={() =>
                  setSelectedUsers((set) => new Set(set.add(Number(friend.id))))
                }
              >
                add
              </button>
            )}
          </div>
        ))}
      <b>dataStores</b>
      {dataStores?.map((dataStore, idx) => (
        <div key={idx}>
          {dataStore.name}
          {selectedDataStores.has(Number(dataStore.id)) ? (
            <button
              onClick={() => {
                selectedDataStores.delete(Number(dataStore.id));
                setSelectedDataStores(() => new Set(selectedDataStores));
              }}
            >
              remove
            </button>
          ) : (
            <button
              onClick={() =>
                setSelectedDataStores(
                  (set) => new Set(set.add(Number(dataStore.id)))
                )
              }
            >
              add
            </button>
          )}
        </div>
      ))}
      <button onClick={share}>share</button>
    </MenuOverlay>
  );
};

export default ShareDataStoreWrapper;
