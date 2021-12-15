import { useGetNodesQueryQuery } from "generated/apolloComponents";
import { CreateHostNodeForm } from "./CreateHostNodeForm";
import React, { useState } from "react";
import { useApolloClient } from "react-apollo";

export const HostsContainer: React.FC = ({ }) => {
    const client: any = useApolloClient();
    const { data, loading, error } = useGetNodesQueryQuery({ client });

    const [createHostNode, setCreateHostNode] = useState(false);

    if (error) {
        console.log(error);
        return null;
    }

    return loading ? (
        <div>Loading...</div>
    ) : (
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
                    {!data?.getNodes?.nodes.filter(({ hostNode }) => !!hostNode)
                        .length && (
                            <div>
                                <button
                                    onClick={() => setCreateHostNode((s) => !s)}
                                >
                                    Create host node
                                </button>
                            </div>
                        )}
                    {data?.getNodes?.nodeRequests.map(({ ip, id, port }, idx) => (
                        <div key={idx}>
                            {ip}:{port}
                            <button>Accept</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
