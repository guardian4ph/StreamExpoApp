import {View, Text, StyleSheet} from "react-native";
import React from "react";

export default function Profile() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Page</Text>
      <Text>to be developed</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
