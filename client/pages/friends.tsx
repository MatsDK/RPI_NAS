import {
  GetFriendsQueryQuery,
  useGetFriendsQueryQuery,
} from "generated/apolloComponents";
import { GetFriendsQuery } from "graphql/Friends/getFriends";
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

interface FriendsProps extends GetFriendsQueryQuery {}

const Container = styled.div`
  padding: 25px 0 0 30px;
  min-width: 300px;

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

const PlaceHolder = styled.span`
  color: ${(props) => props.theme.textColors[2]};
`;

const Friends: NextFunctionComponentWithAuth<FriendsProps> = ({ me }) => {
  useMeState(me);

  const client: any = useApolloClient();

  const { data, loading, error } = useGetFriendsQueryQuery({ client });

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
      refetchQueries: [{ query: GetFriendsQuery }],
    });

    console.log(errors, data);
  };

  return (
    <Layout>
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
              <div key={idx} style={{ display: "flex" }}>
                <span>{f.userName}</span>
                <button onClick={() => acceptFriendRequest(Number(f.id))}>
                  accept
                </button>
              </div>
            ))
          ) : (
            <PlaceHolder>No friends requests</PlaceHolder>
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
            friends?.map((f, idx) => <div key={idx}>{f.userName}</div>)
          ) : (
            <PlaceHolder>No friends</PlaceHolder>
          )}
        </ContainerItem>
      </Container>
      <FindFriendsContainer
        friendsIds={data?.friends?.friends.map((f) => f.id) || []}
      />
    </Layout>
  );
};

Friends.getInitialProps = async ({ apolloClient }: ApolloContext) => {
  const { loading, data } = await apolloClient.query({
    query: GetFriendsQuery,
  });

  if (loading) return { friends: [] };

  return { friends: data.friends };
};

export default withAuth(Friends);
