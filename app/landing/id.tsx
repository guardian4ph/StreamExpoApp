import {View, Text, StyleSheet, TouchableOpacity} from "react-native";
import React from "react";

export default function ID() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ID</Text>
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
