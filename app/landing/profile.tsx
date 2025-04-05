import {View, Text, StyleSheet} from "react-native";
import React, {useEffect} from "react";
import {useIncident} from "@/context/IncidentContext";

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
