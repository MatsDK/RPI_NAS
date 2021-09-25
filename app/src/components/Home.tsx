import React from "react";
import { Query } from "react-apollo";
import {
  AsyncStorage,
  Button,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getMyDataStoresQuery } from "../graphql/Folder/getDataStores";
import { RouteProps } from "../lib/RoutesTypes";

const Home: RouteProps<"Home"> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Query query={getMyDataStoresQuery}>
        {(res: any) => {
          if (res.loading) return <Text>loading</Text>;

          if (res.error || !res.data?.getMyDataStores) {
            return (
              <View>
                <Button
                  title={"Login"}
                  onPress={() => navigation.navigate("Login")}
                />
                <Text>Error</Text>
              </View>
            );
          }

          return (
            <>
              <View>
                <Button
                  title={"Logout"}
                  onPress={async () => {
                    await AsyncStorage.removeItem("access-token");
                    await AsyncStorage.removeItem("refresh-token");

                    await res.client.resetStore();
                  }}
                />
                <FlatList
                  data={res.data.getMyDataStores}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.item}
                      onPress={() => {
                        navigation.navigate("DataStore", {
                          name: item.name,
                          id: item.id,
                          path: "/",
                        });
                      }}
                    >
                      <Text>{item.name}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </>
          );
        }}
      </Query>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  item: {
    borderTopWidth: 2,
    borderTopColor: "#ededed",
  },
  headerTitle: {
    fontWeight: "bold",
    fontSize: 30,
  },
});

export default Home;
