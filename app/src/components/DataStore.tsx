import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { RouteProps } from "../lib/RoutesTypes";
import { Query, useApolloClient } from "react-apollo";
import { getTreeQuery } from "../graphql/Folder/getTree";
import { Button } from "react-native";
import { createSessionMutation } from "../graphql/ShareData/CreateDownloadSession";

interface DataStoreProps { }

const SERVER_URL = "http://192.168.0.209:4000";

export const DataStore: RouteProps<"DataStore", DataStoreProps> = ({
  route: { params },
  navigation,
}) => {
  const client = useApolloClient();

  const [selectedItems, setSelectedItems] = useState<Map<string, any>>(
    new Map()
  );

  const onShare = async () => {
    if (selectedItems.size) {
      const variables = {
        type: "http",
        data: Array.from(selectedItems).map(
          ([_, { relativePath, isDirectory }]) => ({
            path: relativePath,
            type: isDirectory ? "directory" : "file",
          })
        ),
        dataStoreId: Number(params.id),
      };

      const { data, errors } = await client.mutate({
        mutation: createSessionMutation,
        variables,
      });

      const url = `${SERVER_URL}/download?s=${data.createDownloadSession.id}`;
      console.log(errors, data);
    }
  };

  return (
    <Query
      query={getTreeQuery}
      variables={{
        path: params.path,
        datastoreId: Number(params.id),
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
            <Button title={"share"} onPress={onShare} />
            <FlatList
              data={data.tree.tree}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => {
                const selected = selectedItems.has(item.relativePath);

                return (
                  <View
                    style={{
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
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
                        {item.isDirectory ? "dir" : "file"} {item.name}{" "}
                        {selected ? "selected" : ""}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedItems((s) => {
                          if (selected) {
                            s.delete(item.relativePath);
                            return new Map(s);
                          } else return new Map(s.set(item.relativePath, item));
                        });
                      }}
                    >
                      <Text>select</Text>
                    </TouchableOpacity>
                  </View>
                );
              }}
            />
          </View>
        );
      }}
    </Query>
  );
};
