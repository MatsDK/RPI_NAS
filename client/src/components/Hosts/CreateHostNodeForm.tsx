import React, { FormEvent } from "react";
import { ConditionButton } from "src/ui/Button";
import { useInput } from "src/hooks/useInput";
import { useApollo } from "src/hooks/useApollo";
import { CreateHostNodeMutation } from "graphql/Node/createHostNode";

interface CreateHostNodeFormProps {}

export const CreateHostNodeForm: React.FC<CreateHostNodeFormProps> = ({}) => {
    const { mutate } = useApollo();

    const [name, setName] = useInput("");
    const [loginName, setLoginName] = useInput("");
    const [password, setPassword] = useInput("");

    const createNode = async (e: FormEvent) => {
        e.preventDefault();

        if (!name.trim() || !loginName.trim() || !password.trim()) return;

        const res = await mutate(CreateHostNodeMutation, {
            name,
            loginName,
            password,
        });

        console.log(res);
    };

    return (
        <form onSubmit={createNode}>
            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={setName}
            />
            <input
                type="text"
                placeholder="Login Name"
                value={loginName}
                onChange={setLoginName}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={setPassword}
            />
            <ConditionButton
                condition={
                    !!(name.trim() && loginName.trim() && password.trim())
                }
            >
                <button type="submit">Create Host Node</button>
            </ConditionButton>
        </form>
    );
};
