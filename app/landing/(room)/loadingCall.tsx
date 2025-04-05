import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, {useState, useEffect} from "react";
import {useRouter} from "expo-router";
import getEmergencyIcon from "@/utils/GetIcon";
import {useIncident} from "@/context/IncidentContext";

export default function loadingCall() {
  const {incidentState} = useIncident();
  const router = useRouter();
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;
    const abortController = new AbortController();

    const checkIncidentStatus = async () => {
      if (!incidentState?.incidentId) return;

      try {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/incidents/${incidentState.incidentId}`,
          {signal: abortController.signal}
        );
        const incident = await response.json();
        console.log(incident);

        if (incident.isAccepted && mounted) {
          setIsConnected(true);
          clearInterval(interval);
          setTimeout(() => {
            if (mounted) {
              router.push({
                pathname: "/landing/(room)/RoomVerification",
                params: {
                  emergencyType: incidentState.emergencyType,
                  channelId: incidentState.channelId,
                  incidentId: incidentState.incidentId,
                },
              });
            }
          }, 2000);
        }
      } catch (error) {
        if (error !== "AbortError") {
          console.error("Error checking incident status:", error);
        }
      }
    };

    const interval = setInterval(checkIncidentStatus, 4000);
    checkIncidentStatus();

    return () => {
      mounted = false;
      clearInterval(interval);
      abortController.abort();
    };
  }, [incidentState, router]);

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>
          Reporting {incidentState?.emergencyType} Emergency
        </Text>
        <Text style={styles.connecting}>
          {isConnected ? "Connected!" : "Connecting..."}
        </Text>
        <View style={styles.iconContainer}>
          <Image
            source={getEmergencyIcon(incidentState?.emergencyType as string)}
            resizeMode="contain"
            style={styles.emergencyIcon}
          />
        </View>
        <Text style={styles.address}>
          {incidentState?.location?.address || "Location unavailable"}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
    justifyContent: "space-between",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 80,
  },
  title: {
    fontSize: 18,
    color: "#333",
    marginBottom: 20,
  },
  connecting: {
    fontSize: 24,
    fontWeight: "bold",
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
    marginTop: 20,
    textAlign: "center",
    paddingHorizontal: 10,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  cancelButton: {
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
