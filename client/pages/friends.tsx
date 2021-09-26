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

interface FriendsProps extends GetFriendsQueryQuery {}

const Friends: NextFunctionComponentWithAuth<FriendsProps> = ({ me }) => {
  useMeState(me);

  const client: any = useApolloClient();

  const { data, loading, error } = useGetFriendsQueryQuery({ client });

  if (loading) return <div>loading</div>;

  if (error) {
    console.log(error);
    return null;
  }

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
      <div>
        <div>
          <h1>Friend Requests</h1>
          {data?.friends?.friendsRequest.map((f, idx) => (
            <div key={idx} style={{ display: "flex" }}>
              <span>{f.userName}</span>
              <button onClick={() => acceptFriendRequest(Number(f.id))}>
                accept
              </button>
            </div>
          ))}
        </div>
        <div>
          <h1>Friends</h1>
          {data?.friends?.friends.map((f, idx) => (
            <div key={idx}>{f.userName}</div>
          ))}
        </div>
      </div>
      <FindFriendsContainer
        friendsIds={data?.friends?.friends.map((f) => f.id) || []}
      />
    </Layout>
  );
};

Friends.getInitialProps = async (ctx: ApolloContext) => {
  const { loading, data } = await ctx.apolloClient.query({
    query: GetFriendsQuery,
  });

  if (loading) return { friends: [] };

  return { friends: data.friends };
};

export default withAuth(Friends);
