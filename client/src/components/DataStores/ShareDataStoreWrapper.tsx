import {
  useCreateSharedDataStoresMutaionMutation,
  useGetFriendsQueryQuery,
  useGetMyDataStoresQuery,
} from "generated/apolloComponents";
import { CreateSharedDataStoreMutation } from "graphql/DataStores/createSharedDataStore";
import { useState } from "react";
import { useApolloClient } from "react-apollo";
import MenuOverlay from "../MenuOverlay";

interface Props {
  dataStoreId: number;
  hide: () => any;
}

const ShareDataStoreWrapper: React.FC<Props> = ({ hide, dataStoreId }) => {
  const client: any = useApolloClient();

  const {
    data: friends,
    error: friendsError,
    loading: friendsLoading,
  } = useGetFriendsQueryQuery({ client });

  const {
    data: dataStores,
    error: dataStoresError,
    loading: dataStoresLoading,
  } = useGetMyDataStoresQuery({ client });

  const [selectedUsers, setSelectedUsers] = useState<Set<number>>(new Set());
  const [selectedDataStores, setSelectedDataStores] = useState<Set<number>>(
    new Set([dataStoreId])
  );

  if (friendsError || dataStoresError) {
    console.log(friendsError, dataStoresError);
    return <div>errors</div>;
  }

  const share = async () => {
    if (!selectedUsers.size) return alert("you haven't selected any friends");

    if (!selectedDataStores.size)
      return alert("you haven't selected any dataStores to share");

    const res = await client.mutate({
      mutation: CreateSharedDataStoreMutation,
      variables: {
        userIds: Array.from(selectedUsers),
        dataStoreIds: Array.from(selectedDataStores),
      },
    });

    console.log(res);
  };

  return (
    <MenuOverlay hide={hide}>
      <div>share datastore</div>
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
      {!dataStoresLoading &&
        dataStores?.getMyDataStores.map((dataStore, idx) => (
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
