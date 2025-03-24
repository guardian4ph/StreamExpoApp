import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React from "react";
import {useLocalSearchParams, useRouter} from "expo-router";
import getEmergencyIcon from "@/utils/GetIcon";

export default function loadingCall() {
  const {emergencyType, roomId} = useLocalSearchParams();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reporting {emergencyType} Emergency</Text>
      <Text style={styles.connecting}>Connecting...</Text>
      <View style={styles.iconContainer}>
        <Image
          source={getEmergencyIcon(emergencyType as string)}
          resizeMode="contain"
          style={styles.emergencyIcon}
        />
      </View>
      <Text style={styles.address}>A. S. Fortuna St, Mandaue City</Text>

      <TouchableOpacity
        style={styles.proceedButton}
        onPress={() =>
          router.push({
            pathname: "/landing/(room)/RoomVerification",
            params: {
              emergencyType: emergencyType,
              roomId: roomId,
            },
          })
        }>
        <Text style={styles.cancelText}>Proceed</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => router.back()}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 18,
    marginTop: 100,
    color: "#333",
  },
  connecting: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 80,
    marginBottom: 20,
  },
  iconContainer: {
    width: 120,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  emergencyIcon: {
    width: "100%",
    height: "100%",
  },
  address: {
    fontSize: 16,
    color: "#666",
    marginTop: 40,
  },
  proceedButton: {
    position: "absolute",
    bottom: 100,
    backgroundColor: "green",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 6,
    width: "80%",
  },
  cancelButton: {
    position: "absolute",
    bottom: 40,
    backgroundColor: "#FF6B6B",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 6,
    width: "80%",
  },
  cancelText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
});
