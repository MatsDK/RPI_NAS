import { registerMutation } from "graphql/User/register";
import {
  Input,
  Label,
  LoginRegisterPage,
  PageLink,
  SubmitButton,
  Error,
  Title,
} from "./LoginRegisterPage";
import { useRouter } from "next/router";
import React, { FormEvent, useState } from "react";
import { useApollo } from "src/hooks/useApollo";
import { useInput } from "src/hooks/useInput";
import styled from "styled-components";
import Link from "next/link";
import { ConditionButton } from "../ui/Button";

interface RegisterViewProps {}

const RegisterForm = styled.form`
  z-index: 100;
  padding: 100px 80px;
  display: flex;
  flex-direction: column;
`;

export const RegisterView: React.FC<RegisterViewProps> = ({}) => {
  const { mutate } = useApollo();
  const router = useRouter();

  const [userNameInput, setUserNameInput] = useInput("");
  const [emailInput, setEmailInput] = useInput("");
  const [passwordInput, setPasswordInput] = useInput("");
  const [err, setErr] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();

    if (!userNameInput.trim() || !passwordInput.trim() || !emailInput.trim())
      return;

    try {
      const { data } = await mutate(registerMutation, {
        userName: userNameInput,
        email: emailInput,
        password: passwordInput,
      });

      if (data.register) {
        setErr("");
        router.push("/login");
      }
    } catch (e) {
      setErr(e.message.replace("GraphQL error: ", ""));
    }
  };

  return (
    <LoginRegisterPage>
      <RegisterForm onSubmit={submit}>
        <Title>Sign Up</Title>
        <Label>Username</Label>
        <Input
          type="text"
          placeholder="username"
          value={userNameInput}
          onChange={setUserNameInput}
        />
        <Error>{err.includes("Username") && err}</Error>
        <Label>E-mail</Label>
        <Input
          type="text"
          placeholder="@email.com"
          value={emailInput}
          onChange={setEmailInput}
        />
        <Error>{err.includes("Email") && err}</Error>
        <Label>Password</Label>
        <Input
          type="password"
          placeholder="password"
          value={passwordInput}
          onChange={setPasswordInput}
        />
        <Error>{err.includes("password") && err}</Error>
        <ConditionButton
          condition={
            !!emailInput.trim() &&
            !!passwordInput.trim() &&
            !!userNameInput.trim()
          }
        >
          <SubmitButton type="submit">Sign Up</SubmitButton>
        </ConditionButton>
        <Link href="/login">
          <PageLink>Sign In</PageLink>
        </Link>
      </RegisterForm>
    </LoginRegisterPage>
  );
};
