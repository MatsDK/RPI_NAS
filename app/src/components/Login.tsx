import React from "react";
import { Mutation } from "react-apollo";
import { useState } from "react";
import { Button } from "react-native";
import { View, Text, TextInput } from "react-native";
import { RouteProps } from "../lib/RoutesTypes";
import gql from "graphql-tag";
import { getMyDataStoresQuery } from "./Home";

interface LoginProps {}

const loginMutation = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
    }
  }
`;

export const Login: RouteProps<"Login", LoginProps> = ({ navigation }) => {
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  return (
    <View>
      <Text>Login</Text>
      <TextInput
        autoCapitalize="none"
        placeholder={"email"}
        onChangeText={(text) => setEmailInput(text.trim())}
        value={emailInput}
        style={{ padding: 10 }}
      />
      <TextInput
        autoCapitalize="none"
        placeholder={"password"}
        secureTextEntry={true}
        onChangeText={(text) => setPasswordInput(text.trim())}
        value={passwordInput}
        style={{ padding: 10 }}
      />
      <Mutation
        mutation={loginMutation}
        refetchQueries={[{ query: getMyDataStoresQuery }]}
      >
        {(mutate: any) => {
          return (
            <Button
              title="Login"
              onPress={async () => {
                if (!emailInput || !passwordInput) return;

                const res = await mutate({
                  variables: { email: emailInput, password: passwordInput },
                });

                if (res.data?.login?.id != null) {
                  navigation.navigate("Home");
                }
              }}
            />
          );
        }}
      </Mutation>
    </View>
  );
};
