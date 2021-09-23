import React from "react";
import { View, Text } from "react-native";
import { RouteProps } from "../lib/RoutesTypes";

interface DataStoreProps {}

export const DataStore: RouteProps<"DataStore", DataStoreProps> = ({
  route: { params },
}) => {
  console.log(params);
  return (
    <View>
      <Text>datastore, {params.name}</Text>
    </View>
  );
};
