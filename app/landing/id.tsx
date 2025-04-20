import {View, Text, StyleSheet, TouchableOpacity} from "react-native";
import React from "react";
import {useAuth} from "@/context/AuthContext";
import {useIncident} from "@/context/IncidentContext";

export default function ID() {
  const {authState} = useAuth();
  const {incidentState} = useIncident();
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <Text style={styles.label}>User ID:</Text>
        <Text style={styles.value}>{authState?.user_id || "N/A"}</Text>

        <Text style={styles.label}>Token:</Text>

        <Text style={styles.value} numberOfLines={1} ellipsizeMode="tail">
          {authState?.token ? `${authState.token.substring(0, 15)}...` : "N/A"}
        </Text>

        <Text style={styles.label}>Incident Type:</Text>
        <Text style={styles.value}>
          {incidentState?.emergencyType || "N/A"}
        </Text>

        <Text style={styles.label}>Incident ID:</Text>
        <Text style={styles.value} numberOfLines={1} ellipsizeMode="tail">
          {incidentState?.incidentId
            ? `${incidentState.incidentId.substring(0, 15)}...`
            : "N/A"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 10,
    paddingLeft: 10,
    alignItems: "flex-start",
  },

  container: {
    backgroundColor: "rgba(200, 200, 200, 0.1)",
    padding: 5,
    borderRadius: 4,
  },

  label: {
    fontSize: 10,
    color: "#555",
    fontWeight: "bold",
  },

  value: {
    fontSize: 10,
    color: "#777",
    marginBottom: 4,
  },
});
