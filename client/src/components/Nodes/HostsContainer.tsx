import { Node, useGetNodesQueryQuery } from "generated/apolloComponents";
import Link from "next/link";
import React from "react";
import { useApolloClient } from "react-apollo";
import { NodeRequestsList } from "./NodeRequestsList";

export const HostsContainer: React.FC = ({ }) => {
    const client: any = useApolloClient();
    const { data, loading, error } = useGetNodesQueryQuery({ client });

    if (error) {
        console.log(error);
        return null;
    }

    const host = data?.getNodes?.nodes.filter(({ hostNode }) => !!hostNode)[0] as Node

    if (loading) return <div>Loading...</div>

    return (
        <div>
            {data?.getNodes?.nodes.map(({ name, ip, hostNode }, idx) => (
                <div key={idx}>
                    {name}
                    {ip}
                    {hostNode && "Host"}
                </div>
            ))}
            {!host && (
                <div>
                    <Link href={"/nodes/createhost"}>Create host node</Link>
                </div>
            )}
            <NodeRequestsList host={host} nodeRequests={data?.getNodes?.nodeRequests || []} />
        </div>
    );
};
