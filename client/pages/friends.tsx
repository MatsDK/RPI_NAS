import { ProfilePicture } from "src/ui/ProfilePicture";
import { useGetFriendsAndFriendRequestsQueryQuery } from "generated/apolloComponents";
import { GetFriendsAndFriendRequestsQuery } from "graphql/Friends/getFriends";
import { FindFriendsContainer } from "src/components/Friends/FindFriendsContainer";
import React from "react";
import { withAuth } from "src/HOC/withAuth";
import { useMeState } from "src/hooks/useMeState";
import { ApolloContext, NextFunctionComponentWithAuth } from "types/types";
import { Layout } from "../src/components/Layout";
import SideBar from "../src/components/SideBar";
import { useApolloClient } from "react-apollo";
import { acceptFriendRequestMutation } from "graphql/Friends/acceptFriendRequest";
import styled from "styled-components";
import { Scrollbar } from "src/ui/Scrollbar";

const Container = styled.div`
  ${Scrollbar}
  padding: 25px 0 0 30px;
  height: 100%;
  overflow: auto;
  min-width: 300px;
  padding-bottom: 100px;

  > div:not(:last-child) {
    border-bottom: 1px solid ${(props) => props.theme.textColors[3]};
  }
`;

export const Title = styled.h2`
  font-size: 25px;
  font-weight: 600;
  color: ${(props) => props.theme.textColors[0]};

  span {
    color: ${(props) => props.theme.textColors[2]};
    margin-left: 3px;
    font-weight: 400;
    font-size: 14px;
  }
`;

const ContainerItem = styled.div`
  padding: 10px 0;
`;

export const PlaceHolder = styled.span`
  color: ${(props) => props.theme.textColors[2]};
`;

const FriendRequest = styled.div`
  padding: 3px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  :hover button {
    opacity: 1;
  }

  > div {
    align-items: center;
    display: flex;

    span {
      margin-left: 10px;
      font-size: 18px;
      font-weight: 4000;
      color: ${(props) => props.theme.textColors[1]};
    }
  }
`;

const Friend = styled.div`
  padding: 3px;
  display: flex;
  align-items: center;

  span {
    margin-left: 10px;
    font-size: 18px;
    color: ${(props) => props.theme.textColors[1]};
  }
`;

const AcceptButton = styled.button`
  background-color: transparent;
  border: 0;
  outline: none;
  cursor: pointer;
  color: ${(props) => props.theme.textColors[2]};
  transition: 0.15s ease-in-out;
  opacity: 0;

  :hover {
    color: ${(props) => props.theme.textColors[1]};
  }
`;

const Friends: NextFunctionComponentWithAuth = ({ me }) => {
  useMeState(me);

  const client: any = useApolloClient();

  const { data, loading, error } = useGetFriendsAndFriendRequestsQueryQuery({
    client,
  });

  if (loading) return <div>loading</div>;

  if (error) {
    console.log(error);
    return null;
  }

  const friends = data?.friends?.friends,
    friendRequests = data?.friends?.friendsRequest;

  const acceptFriendRequest = async (userId: number) => {
    const { errors, data } = await client.mutate({
      mutation: acceptFriendRequestMutation,
      variables: { userId },
      refetchQueries: [{ query: GetFriendsAndFriendRequestsQuery }],
    });

    console.log(errors, data);
  };

  return (
    <Layout title="Friends">
      <SideBar />
      <Container>
        <ContainerItem>
          <Title>
            Friend Requests
            {friendRequests && friendRequests.length >= 1 ? (
              <span>
                {friendRequests.length} Friend Request
                {friendRequests.length != 1 ? "s" : ""}
              </span>
            ) : null}
          </Title>
          {friendRequests?.length ? (
            friendRequests?.map((f, idx) => (
              <FriendRequest key={idx} style={{ display: "flex" }}>
                <div>
                  <ProfilePicture
                    src={`${process.env.NEXT_PUBLIC_SERVER_URL}/profile/${f.id}`}
                  />
                  <span>{f.userName}</span>
                </div>
                <AcceptButton onClick={() => acceptFriendRequest(Number(f.id))}>
                  Accept
                </AcceptButton>
              </FriendRequest>
            ))
          ) : (
            <PlaceHolder>No friend requests</PlaceHolder>
          )}
        </ContainerItem>
        <ContainerItem>
          <Title>
            Friends
            {friends && friends.length >= 1 ? (
              <span>
                {friends.length} Friend{friends.length != 1 ? "s" : ""}
              </span>
            ) : null}
          </Title>
          {friends?.length ? (
            friends?.map((f, idx) => (
              <Friend key={idx}>
                <ProfilePicture
                  src={`${process.env.NEXT_PUBLIC_SERVER_URL}/profile/${f.id}`}
                />
                <span>{f.userName}</span>
              </Friend>
            ))
          ) : (
            <PlaceHolder>No friends</PlaceHolder>
          )}
        </ContainerItem>
      </Container>
      <FindFriendsContainer
        friendsIds={data?.friends?.friends.map(({ id }) => Number(id)) || []}
        friendRequestsIds={
          data?.friends?.friendsRequest.map(({ id }) => Number(id)) || []
        }
        acceptFriendRequest={acceptFriendRequest}
      />
    </Layout>
  );
};

Friends.getInitialProps = async ({ apolloClient }: ApolloContext) => {
  const { loading, data } = await apolloClient.query({
    query: GetFriendsAndFriendRequestsQuery,
  });

  if (loading) return { friends: [] };

  return { friends: data.friends };
};

export default withAuth(Friends);
