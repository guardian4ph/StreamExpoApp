import {View, Text, StyleSheet, TouchableOpacity} from "react-native";
import React from "react";
import {useAuth} from "@/context/AuthContext";

export default function ID() {
  const {authState} = useAuth();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ID</Text>
      <Text>User ID:</Text>
      <Text>{authState?.user_id || "Not available"}</Text>

      <Text>Token:</Text>
      <Text numberOfLines={3}>{authState?.token || "Not available"}</Text>
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
