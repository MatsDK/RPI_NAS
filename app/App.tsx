import { StatusBar } from "expo-status-bar";
import React from "react";
import Home from "./src/components/Home";
import { StyleSheet, View } from "react-native";

export default () => {
  return (
    <View style={styles.container}>
      <Home />
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
