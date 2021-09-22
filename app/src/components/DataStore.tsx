import React from "react";
import { View, Text } from "react-native";
import { RouteProps } from "../lib/RoutesTypes";

interface DataStoreProps {}

export const DataStore: RouteProps<"DataStore", DataStoreProps> = ({}) => {
  return (
    <View>
      <Text>datastore</Text>
    </View>
  );
};
