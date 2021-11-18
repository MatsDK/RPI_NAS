import { registerMutation } from "graphql/User/register";
import {
  Input,
  Label,
  LoginRegisterPage,
  PageLink,
  SubmitButton,
  Title,
} from "./LoginRegisterPage";
import { useRouter } from "next/router";
import React, { FormEvent } from "react";
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

  const submit = async (e: FormEvent) => {
    e.preventDefault();

    if (!userNameInput.trim() || !passwordInput.trim() || !emailInput.trim())
      return;

    const { data } = await mutate(registerMutation, {
      userName: userNameInput,
      email: emailInput,
      password: passwordInput,
    });

    if (data.register) {
      router.push("/login");
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
        <Label>E-mail</Label>
        <Input
          type="text"
          placeholder="@email.com"
          value={emailInput}
          onChange={setEmailInput}
        />
        <Label>Password</Label>
        <Input
          type="password"
          placeholder="password"
          value={passwordInput}
          onChange={setPasswordInput}
        />
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
