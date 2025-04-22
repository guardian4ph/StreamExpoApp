import {Image, SafeAreaView, StyleSheet, Text, View} from "react-native";
import React, {useEffect} from "react";
import {EmergencyContacts} from "@/assets/data/emergencyContacts";
import {TouchableOpacity} from "react-native";
import {useRouter} from "expo-router";
import {useAuth} from "@/context/AuthContext";
import {useIncident} from "@/context/IncidentContext";
import useLocation from "@/hooks/useLocation";

export default function SelectEmergency() {
  const router = useRouter();
  const {authState} = useAuth();
  const {incidentState, setCurrentIncident} = useIncident();
  const {getUserLocation} = useLocation();

  useEffect(() => {
    const checkExistingIncident = async () => {
      if (incidentState) {
        router.replace({
          pathname: "/landing/(room)/room-verification",
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

  const handleClickEmergency = async (contact: {name: string}) => {
    try {
      const locationData = await getUserLocation();
      let formattedAddress = "Unknown location";
      if (locationData?.response && locationData.response.length > 0) {
        const loc = locationData.response[0];
        formattedAddress = `${loc.street || ""}, ${loc.city || ""}, ${
          loc.region || ""
        }`;
      }

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/incidents`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            incidentType: contact.name,
            userId: authState?.user_id,
            incidentDetails: {
              coordinates: {
                lat: locationData?.latitude || null,
                lon: locationData?.longitude || null,
              },
            },
          }),
        }
      );

      const data = await response.json();
      // console.log("Incident created:", data);

      await setCurrentIncident!({
        emergencyType: contact.name,
        channelId: "fad-call",
        incidentId: data._id,
        isAccepted: data.isAccepted,
        isFinished: data.isFinished,
        timestamp: Date.now(),
        location: {
          lat: locationData?.latitude,
          lon: locationData?.longitude,
          address: formattedAddress,
        },
      });

      router.push("/landing/(room)/loading-call");
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
    justifyContent: "center",
    gap: 1,
  },
  gridItem: {
    width: "45%",
    aspectRatio: 1,
    backgroundColor: "#1B4965",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    marginBottom: 1,
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
