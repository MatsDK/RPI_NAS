import { registerMutation } from "graphql/User/register";
import React, { FormEvent } from "react";
import { useApolloClient } from "react-apollo";
import { useInput } from "src/hooks/useInput";

const register = () => {
  const client = useApolloClient();

  const [userNameInput, setUserNameInput] = useInput("");
  const [emailInput, setEmailInput] = useInput("");
  const [passwordInput, setPasswordInput] = useInput("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();

    if (!userNameInput.trim() || !passwordInput.trim() || !emailInput.trim())
      return;

    const res = await client.mutate({
      mutation: registerMutation,
      variables: {
        userName: userNameInput,
        email: emailInput,
        password: passwordInput,
      },
    });

    console.log(res);
  };

  return (
    <div>
      <form onSubmit={submit}>
        <input
          type="text"
          placeholder="userName"
          value={userNameInput}
          onChange={setUserNameInput}
        />
        <input
          type="text"
          placeholder="email"
          value={emailInput}
          onChange={setEmailInput}
        />
        <input
          type="password"
          placeholder="password"
          value={passwordInput}
          onChange={setPasswordInput}
        />
        <button type="submit">register</button>
      </form>
    </div>
  );
};

export default register;
