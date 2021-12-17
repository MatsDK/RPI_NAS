import { useRouter } from "next/router";
import React from "react";
import { Layout } from "src/components/Layout";
import SideBar from "src/components/SideBar";
import { withAuth } from "src/HOC/withAuth";
import { useMeState } from "src/hooks/useMeState";
import { HostsContainer } from "src/components/Hosts/HostsContainer";

import { ApolloContext, NextFunctionComponentWithAuth } from "types/types";
import { getNodesQuery } from "graphql/Node/getNodes";

const Hosts: NextFunctionComponentWithAuth = ({ me }) => {
    const { me: _me } = useMeState(me);
    const router = useRouter();

    if (me && !me.isAdmin) {
        router.back();
    }

    return (
        <Layout>
            <SideBar />
            <HostsContainer />
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

export default withAuth(Hosts);
