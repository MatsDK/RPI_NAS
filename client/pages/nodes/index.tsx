import React from "react";
import { Layout } from "src/components/Layout";
import SideBar from "src/components/SideBar";
import { withAuth } from "src/HOC/withAuth";
import { useMeState } from "src/hooks/useMeState";
import { NodesView } from "src/components/Nodes/NodesView";

import { ApolloContext, NextFunctionComponentWithAuth } from "types/types";
import { getNodesQuery } from "graphql/Node/getNodes";

const Hosts: NextFunctionComponentWithAuth = ({ me }) => {
    useMeState(me);

    return (
        <Layout title="Nodes">
            <SideBar />
            <NodesView />
        </Layout>
    );
};

Hosts.getInitialProps = async ({ apolloClient }: ApolloContext) => {
    const { loading, data } = await apolloClient.query({
        query: getNodesQuery,
    });
    if (loading) return { nodes: null };

    return { nodes: data.getNodes.nodes };
};

export default withAuth(Hosts, (me) => me.isAdmin);
