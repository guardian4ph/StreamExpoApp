import {Image, SafeAreaView, StyleSheet, Text, View} from "react-native";
import React, {useEffect} from "react";
import {EmergencyContacts} from "@/assets/data/emergencyContacts";
import {TouchableOpacity} from "react-native";
import {useRouter} from "expo-router";
import {useAuth} from "@/context/AuthContext";
import {useIncident} from "@/context/IncidentContext";

export default function SelectEmergency() {
  const router = useRouter();
  const {authState} = useAuth();
  const {incidentState, setCurrentIncident} = useIncident();

  useEffect(() => {
    const checkExistingIncident = async () => {
      if (incidentState) {
        router.replace({
          pathname: "/landing/(room)/RoomVerification",
          params: {
            emergencyType: incidentState.emergencyType,
            channelId: incidentState.channelId,
            incidentId: incidentState.incidentId,
          },
        });
      }
    };
    checkExistingIncident();
  }, []);

  const handleClickEmergency = async (contact: {
    name: string;
    roomId: string;
  }) => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/incidents`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            incidentType: contact.name,
            isVerified: false,
            isResolved: false,
            isAccepted: false,
            userId: authState?.user_id,
          }),
        }
      );

      const data = await response.json();
      console.log("Incident created:", data);

      await setCurrentIncident!({
        emergencyType: contact.name,
        channelId: "fad-call",
        incidentId: data._id,
        timestamp: Date.now(),
      });

      router.push({
        pathname: "/landing/(room)/loadingCall",
        params: {
          emergencyType: contact.name,
          channelId: "fad-call",
          incidentId: data._id,
        },
      });
    } catch (error) {
      console.error("Error creating incident:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.centerContainer}>
        <View style={styles.grid}>
          {EmergencyContacts.map((contact) => (
            <TouchableOpacity
              key={contact.id}
              style={styles.gridItem}
              onPress={() => handleClickEmergency(contact)}>
              <Image
                source={contact.icon}
                style={styles.icon}
                resizeMode="contain"
              />
              <Text style={styles.label}>{contact.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f5f5",
    padding: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  grid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    gap: 10,
  },
  gridItem: {
    width: "42%",
    aspectRatio: 1,
    backgroundColor: "#1B4965",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  icon: {
    width: "80%",
    height: "60%",
    marginBottom: 10,
  },
  label: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});
