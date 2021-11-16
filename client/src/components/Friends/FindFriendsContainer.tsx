import { SendFriendRequestMutation } from "graphql/Friends/sendFriendRequest";
import { ProfilePicture } from "src/ui/ProfilePicture";
import Icon from "src/ui/Icon";
import { PlaceHolder, Title } from "pages/friends";
import { FindUsersQuery } from "graphql/User/findUsers";
import React, { FormEvent, useState } from "react";
import { useApollo } from "src/hooks/useApollo";
import { useTimeoutInput } from "src/hooks/useTimeoutInput";
import styled from "styled-components";
import { Scrollbar } from "src/ui/Scrollbar";
import { Button } from "src/ui/Button";

interface FindFriendsContainerProps {
  friendsIds: number[];
  friendRequestsIds: number[];
  acceptFriendRequest: (userId: number) => Promise<void>;
}

const Header = styled.div`
  border-bottom: 1px solid ${(props) => props.theme.textColors[3]};
  min-width: 500px;
  padding: 4px 10px;
  display: flex;
`;

const Container = styled.div`
  padding: 15px;
  flex: 1;
`;

const Input = styled.div`
  padding: 2px;
  margin-left: 15px;
  border-radius: 3px;
  display: flex;
  background-color: ${(props) => props.theme.lightBgColors[1]};

  input {
    border: 0;
    background: transparent;
    outline: none;
    padding: 2px 5px;
    font-size: 18px;
    width: 100%;
    height: 100%;
  }

  button {
    display: grid;
    place-items: center;
    border: 0;
    outline: none;
    cursor: pointer;
    padding-right: 5px;
  }
`;

const FoundUsersContainer = styled.div`
  ${Scrollbar}
  height: 100%;
  overflow: scroll;
  padding: 5px 10px;
`;

const Friend = styled.div`
  min-width: 200px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;

  > div {
    display: flex;
    align-items: center;

    > span {
      margin-left: 10px;
      color: ${(props) => props.theme.textColors[1]};
      font-size: 18px;
    }
  }
`;

export const FindFriendsContainer: React.FC<FindFriendsContainerProps> = ({
  friendsIds,
  friendRequestsIds,
  acceptFriendRequest,
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
    <Container>
      <Header>
        <Title>Search Friends</Title>
        <form onSubmit={search}>
          <Input>
            <input
              type="text"
              placeholder={"Name"}
              value={nameInput}
              onChange={setNameInput}
            />
            <button type="submit">
              <Icon
                name={"searchIcon"}
                width={20}
                height={20}
                color={{ idx: 1, propName: "textColors" }}
              />
            </button>
          </Input>
        </form>
      </Header>
      <FoundUsersContainer>
        {foundUsers == null ? null : !foundUsers.length ? (
          <PlaceHolder>No users found</PlaceHolder>
        ) : (
          foundUsers.map((u, idx) => (
            <Friend key={idx}>
              <div>
                <ProfilePicture
                  src={`${process.env.NEXT_PUBLIC_SERVER_URL}/profile/${u.id}`}
                />

                <span>{u.userName}</span>
              </div>
              {friendsIds.includes(Number(u.id)) ? (
                <PlaceHolder>Already your friend</PlaceHolder>
              ) : friendRequestsIds.includes(Number(u.id)) ? (
                <Button onClick={() => acceptFriendRequest(Number(u.id))}>
                  Accept request
                </Button>
              ) : (
                <Button onClick={() => sendFriendRequest(Number(u.id))}>
                  Send request
                </Button>
              )}
            </Friend>
          ))
        )}
      </FoundUsersContainer>
    </Container>
  );
};
