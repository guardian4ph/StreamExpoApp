import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import React, {useEffect, useState, useCallback} from "react";
import {EmergencyContacts} from "@/assets/data/emergencyContacts";
import {TouchableOpacity} from "react-native";
import {useRouter} from "expo-router";
import {useIncidentStore} from "@/context/useIncidentStore";
import useLocation from "@/hooks/useLocation";
import {useAuthStore} from "@/context/useAuthStore";

interface LocationData {
  latitude: number;
  longitude: number;
  response: {
    street: any;
    city: any;
    region: any;
    country: any;
  }[];
}

export default function SelectEmergency() {
  const router = useRouter();
  const {incidentState, setCurrentIncident} = useIncidentStore();
  const {getUserLocation} = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingEmergencyType, setLoadingEmergencyType] = useState<
    string | null
  >(null);
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [locationFetched, setLocationFetched] = useState(false);
  const {user_id} = useAuthStore();

  // should fetch location when user lands on dius page
  useEffect(() => {
    const prefetchLocation = async () => {
      try {
        const data = await getUserLocation();
        if (data) {
          setLocationData(data);
          setLocationFetched(true);
        }
      } catch (error) {
        console.error("Error prefetching location:", error);
      }
    };

    prefetchLocation();
  }, []);

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

  const formatAddress = useCallback((locData: any) => {
    let formattedAddress = "Unknown location";
    if (locData?.response && locData.response.length > 0) {
      const loc = locData.response[0];
      formattedAddress = `${loc.street || ""}, ${loc.city || ""}, ${
        loc.region || ""
      }`;
    }
    return formattedAddress;
  }, []);

  const createIncident = useCallback(
    async (contactName: any, locData: any) => {
      try {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/incidents`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              incidentType: contactName,
              userId: user_id,
              incidentDetails: {
                coordinates: {
                  lat: locData?.latitude || null,
                  lon: locData?.longitude || null,
                },
              },
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`);
        }

        return await response.json();
      } catch (error) {
        console.error("Error creating incident:", error);
        throw error;
      }
    },
    [user_id]
  );

  const handleClickEmergency = async (contact: {name: string}) => {
    try {
      setIsLoading(true);
      setLoadingEmergencyType(contact.name);
      const locData = locationFetched ? locationData : await getUserLocation();
      const formattedAddress = formatAddress(locData);
      const data = await createIncident(contact.name, locData);

      await setCurrentIncident!({
        emergencyType: contact.name,
        channelId: "fad-call",
        incidentId: data._id,
        isAccepted: data.isAccepted,
        isFinished: data.isFinished,
        timestamp: Date.now(),
        location: {
          lat: locData?.latitude,
          lon: locData?.longitude,
          address: formattedAddress,
        },
      });

      router.push("/landing/(room)/loading-call");
    } catch (error) {
      console.error("Error handling emergency:", error);
      setIsLoading(false);
      setLoadingEmergencyType(null);
    }
  };

  const renderEmergencyButton = useCallback(
    (contact: any) => {
      const isContactLoading =
        isLoading && loadingEmergencyType === contact.name;

      return (
        <TouchableOpacity
          key={contact.id}
          style={[styles.gridItem, isContactLoading && styles.loadingGridItem]}
          onPress={() => handleClickEmergency(contact)}
          disabled={isLoading}>
          {isContactLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#ffffff" />
              <Text style={styles.loadingText}>Reporting...</Text>
            </View>
          ) : (
            <>
              <Image
                source={contact.icon}
                style={styles.icon}
                resizeMode="contain"
              />
              <Text style={styles.label}>{contact.name}</Text>
            </>
          )}
        </TouchableOpacity>
      );
    },
    [isLoading, loadingEmergencyType, handleClickEmergency]
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.centerContainer}>
        <View style={styles.grid}>
          {EmergencyContacts.map(renderEmergencyButton)}
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
  loadingGridItem: {
    opacity: 0.8,
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
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: "white",
    marginTop: 10,
    fontSize: 14,
  },
});
