import { useGetNodesQueryQuery } from "generated/apolloComponents";
import { ConditionButton } from "src/ui/Button";
import { CreateHostNodeForm } from "./CreateHostNodeForm";
import React, { useState } from "react";
import { useApolloClient } from "react-apollo";
import { useInput } from "src/hooks/useInput";
import { useApollo } from "src/hooks/useApollo";
import { AcceptNodeRequestMutation } from "graphql/Node/acceptNodeRequest";

export const HostsContainer: React.FC = ({ }) => {
    const client: any = useApolloClient();
    const { data, loading, error } = useGetNodesQueryQuery({ client });

    const [createHostNode, setCreateHostNode] = useState(false);
    const [acceptNodeId, setAcceptNodeId] = useState<null | number>(null);


    if (error) {
        console.log(error);
        return null;
    }

    const host = data?.getNodes?.nodes.filter(({ hostNode }) => !!hostNode)[0]


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
                    {!host && (
                        <div>
                            <button
                                onClick={() => setCreateHostNode((s) => !s)}
                            >
                                Create host node
                            </button>
                        </div>
                    )}
                    {data?.getNodes?.nodeRequests.map(({ ip, id, port }, idx) => {
                        const showAcceptForm = id === acceptNodeId

                        return (
                            <div key={idx} >
                                <div style={{ display: "flex" }}>
                                    {ip}:{port}
                                    <ConditionButton condition={!!host}>
                                        <button onClick={() => setAcceptNodeId(() => showAcceptForm ? null : id)}>Accept</button>
                                    </ConditionButton>
                                </div>

                                {showAcceptForm &&
                                    <AcceptNodeRequestForm id={id} hostLoginName={host!.loginName} />
                                }
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    );
};

interface AcceptNodeRequest {
    id: number
    hostLoginName: string
}

const AcceptNodeRequestForm: React.FC<AcceptNodeRequest> = ({ id, hostLoginName }) => {
    const { mutate } = useApollo()

    const [name, setName] = useInput("")
    const [loginName, setLoginName] = useInput(hostLoginName)
    const [password, setPassword] = useInput("")

    const acceptRequest = async () => {
        const res = await mutate(AcceptNodeRequestMutation, {
            id,
            name,
            loginName,
            password
        })
        console.log(res);

        if (!res.data.acceptNodeRequest) {
            console.log(res)
        }
    }

    return <form onSubmit={acceptRequest}>
        <input placeholder="Name" value={name} onChange={setName} />
        <input placeholder="loginName" value={loginName} onChange={setLoginName} />
        <input placeholder="pasword" value={password} onChange={setPassword} />
        <ConditionButton condition={!!(name.trim() && loginName.trim() && password.trim())}>
            <button type="submit">Accept</button>
        </ConditionButton>
    </form>
}

