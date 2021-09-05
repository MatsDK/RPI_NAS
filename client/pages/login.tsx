import { useApolloClient } from "react-apollo";
import { FormEvent, useState } from "react";
import { loginMutation } from "graphql/User/login";
import { ApolloClient } from "apollo-boost";

const login = () => {
  const client: ApolloClient<object> = useApolloClient();

  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();

    const res = await client.mutate({
      variables: {
        password: passwordInput,
        email: emailInput,
      },
      mutation: loginMutation,
      optimisticResponse: true,
    });

    console.log(res);
  };

  return (
    <div>
      <form onSubmit={submit}>
        <input
          type="text"
          placeholder="email"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
        />
        <button type="submit">login</button>
      </form>
    </div>
  );
};

export default login;
