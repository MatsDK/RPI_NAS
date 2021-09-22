import React from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { RouteProps } from "../lib/RoutesTypes";

export const getMyDataStoresQuery = gql`
  query getMyDataStores {
    getMyDataStores {
      id
      name
    }
  }
`;

const Home: RouteProps<"Home"> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View>
        <Query query={getMyDataStoresQuery}>
          {(res: any) => {
            if (res.loading) return <Text>loading</Text>;

            if (res.error || !res.data?.getMyDataStores) {
              console.log(res.error);
              return <Text>error</Text>;
            }

            return (
              <FlatList
                data={res.data.getMyDataStores}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.item}
                    onPress={() => {
                      navigation.navigate("DataStore");
                    }}
                  >
                    <Text>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
            );
          }}
        </Query>
      </View>
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
