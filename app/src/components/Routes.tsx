import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Home from "./Home";
import { DataStore } from "./DataStore";
import { ParamList } from "../lib/RoutesTypes";
import { Login } from "./Login";

interface RoutesProps {}

const Stack = createStackNavigator<ParamList>();

export const Routes: React.FC<RoutesProps> = ({}) => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          options={{ title: "Datastores" }}
          name="Home"
          component={Home}
        />
        <Stack.Screen
          options={{ title: "dataStore view" }}
          name="DataStore"
          component={DataStore}
        />
        <Stack.Screen name="Login" component={Login} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
