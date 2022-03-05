import { GetFriendsAndFriendRequestsQuery } from "graphql/Friends/getFriends";
import React from "react";
import { FriendsView } from "src/components/Friends/FriendsView";
import { Layout } from '../src/components/Layout';
import { withAuth } from "src/HOC/withAuth";
import { useMeState } from "src/hooks/useMeState";
import { ApolloContext, NextFunctionComponentWithAuth } from "types/types";

const Friends: NextFunctionComponentWithAuth = ({ me }) => {
  useMeState(me);

  return <Layout title="Friends">
    {/* <FriendsView /> */}
    <FriendsView></FriendsView>
  </Layout>
};

Friends.getInitialProps = async ({ apolloClient }: ApolloContext) => {
  const { loading, data } = await apolloClient.query({
    query: GetFriendsAndFriendRequestsQuery,
  });

  if (loading) return { friends: [] };

  return { friends: data.friends };
};

export default withAuth(Friends);
