import React, { FormEvent, useState } from "react";
import { BgButton, LoadingOverlay } from "src/ui/Button";
import { Input, Label } from "src/ui/Input";
import { ConditionButton } from "src/ui/Button";
import { useInput } from "src/hooks/useInput";
import { useApollo } from "src/hooks/useApollo";
import { CreateHostNodeMutation } from "graphql/Node/createHostNode";
import { getNodesQuery } from "graphql/Node/getNodes";
import styled from "styled-components";
import { useRouter } from "next/router";

const Wrapper = styled.div`
    width: 100%;
`

const Form = styled.form`
    display: flex;
    padding: 10px 50px;
    flex-direction: column;

    > div {
        display: flex;
        margin: 20px 0;

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

    const [name, setName] = useInput("");
    const [loginName, setLoginName] = useInput("");
    const [password, setPassword] = useInput("");

    const [loading, setLoading] = useState(false)

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
            router.push("/nodes")
        } catch (e) {
            console.log(e)
            setLoading(false)
        }
    };

    return (
        <Wrapper>
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
                        !!(name.trim() && loginName.trim() && password.trim())
                    }
                >
                    <LoadingOverlay loading={loading}>
                        <BgButton type="submit">Create Host Node</BgButton>
                    </LoadingOverlay>
                </ConditionButton>
            </Form>
        </Wrapper>
    );
};
