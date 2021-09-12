import { ApolloClient } from "apollo-boost";
import { loginMutation } from "graphql/User/login";
import { FormEvent } from "react";
import { useApolloClient } from "react-apollo";
import { useInput } from "src/hooks/useInput";

const login = () => {
  const client: ApolloClient<object> = useApolloClient();

  const [emailInput, setEmailInput] = useInput("");
  const [passwordInput, setPasswordInput] = useInput("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();

    if (!passwordInput.trim() || !emailInput.trim()) return;

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
          onChange={setEmailInput}
        />
        <input
          type="password"
          placeholder="password"
          value={passwordInput}
          onChange={setPasswordInput}
        />
        <button type="submit">login</button>
      </form>
    </div>
  );
};

export default login;