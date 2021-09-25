import { GetFriendsQueryQuery } from "generated/apolloComponents";
import { GetFriendsQuery } from "graphql/User/getFriends";
import { FindFriendsContainer } from "src/components/Friends/FindFriendsContainer";
import React from "react";
import { withAuth } from "src/HOC/withAuth";
import { useMeState } from "src/hooks/useMeState";
import { ApolloContext, NextFunctionComponentWithAuth } from "types/types";
import { Layout } from "../src/components/Layout";
import SideBar from "../src/components/SideBar";

interface FriendsProps extends GetFriendsQueryQuery {}

const Friends: NextFunctionComponentWithAuth<FriendsProps> = ({
  me,
  friends,
}) => {
  useMeState(me);

  return (
    <Layout>
      <SideBar />
      <div>
        <h1>Friends</h1>
        {friends.map((f, idx) => (
          <div key={idx}>{f.userName}</div>
        ))}
      </div>
      <FindFriendsContainer friendsIds={friends.map((f) => f.id)} />
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
