import React from "react";
import path from "path";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { RouteProps } from "../lib/RoutesTypes";
import { Query } from "react-apollo";
import { getTreeQuery } from "../graphql/Folder/getTree";

interface DataStoreProps {}

export const DataStore: RouteProps<"DataStore", DataStoreProps> = ({
  route: { params },
  navigation,
}) => {
  return (
    <Query
      query={getTreeQuery}
      variables={{
        path: params.path,
        dataStoreId: Number(params.id),
        depth: 1,
      }}
    >
      {({ error, loading, data }: any) => {
        if (loading) return <Text>loading</Text>;

        if (error || !data.tree?.tree) {
          console.log(error);
          return <Text>error</Text>;
        }

        return (
          <View>
            <Text>datastore, {params.name}</Text>
            <FlatList
              data={data.tree.tree}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    item.isDirectory &&
                      navigation.push("DataStore", {
                        id: params.id,
                        path: item.relativePath,
                        name: params.name,
                      });
                  }}
                >
                  <Text>
                    {item.isDirectory ? "dir" : "file"} {item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        );
      }}
    </Query>
  );
};
