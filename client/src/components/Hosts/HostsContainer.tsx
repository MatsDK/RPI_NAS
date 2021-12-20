import { Node, useGetNodesQueryQuery } from "generated/apolloComponents";
import React, { useState } from "react";
import { useApolloClient } from "react-apollo";
import { CreateHostNodeForm } from "./CreateHostNodeForm";
import { NodeRequestsList } from "./NodeRequestsList";

export const HostsContainer: React.FC = ({ }) => {
    const client: any = useApolloClient();
    const { data, loading, error } = useGetNodesQueryQuery({ client });

    const [createHostNode, setCreateHostNode] = useState(false);

    if (error) {
        console.log(error);
        return null;
    }

    const host = data?.getNodes?.nodes.filter(({ hostNode }) => !!hostNode)[0] as Node

    if (loading) return <div>Loading...</div>

    return (
        <div>
            {createHostNode ? (
                <CreateHostNodeForm />
            ) : (
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
                            <button
                                onClick={() => setCreateHostNode((s) => !s)}
                            >
                                Create host node
                            </button>
                        </div>
                    )}
                    <NodeRequestsList host={host} nodeRequests={data?.getNodes?.nodeRequests || []} />
                </div>
            )}
        </div>
    );
};
