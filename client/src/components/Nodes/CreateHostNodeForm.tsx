import React, { FormEvent, useState } from "react";
import { BgButton, ConditionButton } from "src/ui/Button";
import { useInput } from "src/hooks/useInput";
import { useApollo } from "src/hooks/useApollo";
import { CreateHostNodeMutation } from "graphql/Node/createHostNode";
import { Input, Label } from "src/ui/Input";
import { getNodesQuery } from "graphql/Node/getNodes";
import styled from "styled-components";
import { LoadingOverlay } from "src/ui/Button";
import { useGetNodesQueryQuery } from "generated/apolloComponents";
import { useRouter } from "next/router";
import { useApolloClient } from "@apollo/react-hooks";

const Form = styled.form`
    padding: 20px 50px 0 50px;
    display: flex;
    flex-direction: column;

    > div {
        display: flex;
        margin-bottom: 20px;

        > div {
            display: flex;
            flex-direction: column;

            :first-child {
                margin-right: 40px;
            }
        }
    }
`

interface CreateHostNodeFormProps { }

export const CreateHostNodeForm: React.FC<CreateHostNodeFormProps> = ({ }) => {
    const { mutate } = useApollo();
    const router = useRouter()
    const client = useApolloClient() as any

    const [name, setName] = useInput("");
    const [loginName, setLoginName] = useInput("");
    const [password, setPassword] = useInput("");

    const [loading, setLoading] = useState(false)

    const { data, loading: getNodesLoading } = useGetNodesQueryQuery({ client })

    if (data?.getNodes?.nodes.find(({ hostNode }) => hostNode))
        router.push("/nodes")


    const createNode = async (e: FormEvent) => {
        e.preventDefault();

        if (!name.trim() || !loginName.trim() || !password.trim()) return;

        try {
            setLoading(true)
            const res = await mutate(CreateHostNodeMutation, {
                name,
                loginName,
                password,
            }, { refetchQueries: [{ query: getNodesQuery, variables: {} }] });
            setLoading(false)

            console.log(res);
        } catch (e) {
            console.log(e)
            setLoading(false)
        }
    };

    return (
        <Form onSubmit={createNode}>
            <Label>Name</Label>
            <Input
                type="text"
                placeholder="Name"
                value={name}
                onChange={setName}
            />
            <div>
                <div>
                    <Label>Login name</Label>
                    <Input
                        type="text"
                        placeholder="Login Name"
                        value={loginName}
                        onChange={setLoginName}
                    />
                </div>
                <div>
                    <Label>Login password</Label>
                    <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={setPassword}
                    />
                </div>
            </div>
            <ConditionButton
                condition={
                    !getNodesLoading && !!(name.trim() && loginName.trim() && password.trim())
                }
            >
                <LoadingOverlay loading={loading}>
                    <BgButton type="submit">Create Host Node</BgButton>
                </LoadingOverlay>
            </ConditionButton>
        </Form>
    );
};
