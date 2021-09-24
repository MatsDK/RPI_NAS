import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import React from "react";

export type ParamList = {
  Home: undefined;
  DataStore: { name: string; id: string; path: string };
  Login: undefined;
};

export type RouteProps<T extends keyof ParamList, P = {}> = React.FC<
  P & {
    navigation: StackNavigationProp<ParamList, T>;
    route: RouteProp<ParamList, T>;
  }
>;
