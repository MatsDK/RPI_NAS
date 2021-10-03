import { SendFriendRequestMutation } from "graphql/Friends/sendFriendRequest";
import { FindUsersQuery } from "graphql/User/findUsers";
import React, { FormEvent, useState } from "react";
import { useApollo } from "src/hooks/useApollo";
import { useTimeoutInput } from "src/hooks/useTimeoutInput";

interface FindFriendsContainerProps {
  friendsIds: string[];
}

export const FindFriendsContainer: React.FC<FindFriendsContainerProps> = ({
  friendsIds,
}) => {
  const { query, mutate } = useApollo();

  const [foundUsers, setFoundUsers] = useState<any[] | null>(null);

  const cb = async (val: string) => {
    if (!val.trim()) return;

    const { data, errors } = await query(FindUsersQuery, { name: val.trim() });

    if (errors) return console.log(errors);

    setFoundUsers(data.getUsersByName);
  };

  const [nameInput, setNameInput, clearTimeout] = useTimeoutInput<string>(
    500,
    "",
    cb
  );

  const search = (e: FormEvent) => {
    e.preventDefault();

    clearTimeout();

    cb(nameInput);
  };

  const sendFriendRequest = async (userId: number) => {
    const { errors, data } = await mutate(SendFriendRequestMutation, {
      userId,
    });

    if (errors) return console.log(errors);

    console.log(data);
  };

  return (
    <div>
      <form onSubmit={search}>
        <input type="text" value={nameInput} onChange={setNameInput} />
        <button type="submit"></button>
      </form>
      {foundUsers == null
        ? null
        : !foundUsers.length
        ? "no users found"
        : foundUsers.map((u, idx) => (
            <div key={idx}>
              <span>{u.userName}</span>
              {friendsIds.includes(u.id) ? (
                "already your friend"
              ) : (
                <button
                  type="submit"
                  onClick={() => sendFriendRequest(Number(u.id))}
                >
                  send friend request
                </button>
              )}
            </div>
          ))}
    </div>
  );
};
