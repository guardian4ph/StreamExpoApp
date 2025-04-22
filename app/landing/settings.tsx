import {View, Text, StyleSheet} from "react-native";
import React from "react";
import {useAuth} from "@/context/AuthContext";
import {TouchableOpacity} from "react-native-gesture-handler";
import { useIncident } from "@/context/IncidentContext";


export default function Settings() {
  const {onLogout} = useAuth();
  const {clearIncident} = useIncident();

  const handleClear = () => {
    clearIncident!();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <TouchableOpacity style={{backgroundColor: '#f4f0ec', padding: 7, borderRadius: 5, borderWidth: 1,}} onPress={handleClear}>
      <Text style={{color: '#000', fontStyle: 'italic', fontSize: 12}}>*For testing purposes only*</Text>
        <Text style={{color: '#000', textAlign: 'center', fontWeight: 'bold'}}>CLEAR INCIDENT</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
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
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: "#f44336",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
  },
});
