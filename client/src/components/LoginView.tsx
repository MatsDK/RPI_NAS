import { loginMutation } from "graphql/User/login";
import { useRouter } from "next/router";
import React, { FormEvent } from "react";
import { useApollo } from "src/hooks/useApollo";
import { useInput } from "src/hooks/useInput";
import styled from "styled-components";

interface loginViewProps {}

const Container = styled.div`
  background-color: ${(props) => props.theme.bgColors[0]};
  width: 100vw;
  height: 100vh;
`;

const LoginForm = styled.form`
  background-color: ${(props) => props.theme.ligthBgColors[0]};
  width: 30vw;
  height: 100vw;
`;

export const LoginView: React.FC<loginViewProps> = ({}) => {
  const { mutate } = useApollo();
  const router = useRouter();

  const [emailInput, setEmailInput] = useInput("");
  const [passwordInput, setPasswordInput] = useInput("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();

    if (!passwordInput.trim() || !emailInput.trim()) return;

    const { data } = await mutate(loginMutation, {
      password: passwordInput,
      email: emailInput,
    });

    if (data.login) router.push("/");
  };

  return (
    <Container>
      <LoginForm onSubmit={submit}>
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
      </LoginForm>
    </Container>
  );
};
