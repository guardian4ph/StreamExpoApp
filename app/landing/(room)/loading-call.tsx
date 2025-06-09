import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, {useState, useEffect, useCallback} from "react";
import {useRouter} from "expo-router";
import GetIcon from "@/utils/GetIcon";
import {useIncidentStore} from "@/context/useIncidentStore";
import GetEmergencyIcon from "@/utils/GetEmergencyIcon";
import {useFetchIncident} from "@/api/incidents/useFetchIncident";

export default function ConnectingCallPage() {
  const {incidentState, clearActiveIncident} = useIncidentStore();
  const router = useRouter();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const {data: incident} = useFetchIncident(incidentState?._id || "");

  const handleAcceptedIncident = useCallback(() => {
    if (incident?.isAccepted && incidentState) {
      setIsConnected(true);
      setTimeout(() => {
        router.push({
          pathname: "/landing/(room)/room-verification",
          params: {
            emergencyType: incidentState.incidentType,
            channelId: incidentState.channelId,
            incidentId: incidentState._id,
          },
        });
      }, 1000);
    }
  }, [incident?.isAccepted, incidentState, router]);

  useEffect(() => {
    handleAcceptedIncident();
  }, [handleAcceptedIncident]);

  const handleCancel = () => {
    Alert.alert(
      "Cancel Incident",
      "Are you sure you want to cancel the incident?"
    );
    clearActiveIncident!();
    router.replace("/landing/(room)");
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>
          Reporting {incidentState?.incidentType} Emergency
        </Text>
        <Text style={styles.connecting}>
          {isConnected ? "Connected!" : "Connecting..."}
        </Text>
        <View style={styles.iconContainer}>
          <Image
            source={GetEmergencyIcon(incidentState?.incidentType as string)}
            resizeMode="contain"
            style={styles.emergencyIcon}
          />
        </View>
        <Text style={styles.address}>
          {incidentState?.incidentDetails?.location || "Location unavailable"}
        </Text>
      </View>

      {!isConnected && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
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
