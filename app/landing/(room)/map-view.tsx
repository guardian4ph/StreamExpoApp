import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  Image,
  Platform,
} from "react-native";
import React, {useState, useEffect} from "react";
import MapView, {Marker, PROVIDER_GOOGLE, Region} from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import {useIncident} from "@/context/IncidentContext";
import {Ionicons} from "@expo/vector-icons";
import {useRouter} from "expo-router";
import formatResponderStatus from "@/utils/FormatResponderStatus";

const {width, height} = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const GOOGLE_MAPS_API_KEY =
  process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ||
  "";

export default function MapViewScreen() {
  const {incidentState} = useIncident();
  const [responderStatus, setResponderStatus] = useState(
    incidentState?.responderStatus || "enroute"
  );
  const [responderCoords, setResponderCoords] = useState({
    latitude: 10.38029,
    longitude: 123.96444,
  });
  const [distance, setDistance] = useState<string>("--");
  const [duration, setDuration] = useState<string>("--");
  const [mapRegion, setMapRegion] = useState<Region | null>(null);
  const [directionsError, setDirectionsError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    const checkIncidentStatus = async () => {
      if (!incidentState?.incidentId) return;
      try {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/incidents/${incidentState?.incidentId}`
        );
        const incident = await response.json();
        if (incident.responderStatus && mounted) {
          setResponderStatus(incident.responderStatus);
        }

        // Update responder coordinates if available
        if (incident.responderCoordinates && mounted) {
          const newCoords = {
            latitude: incident.responderCoordinates.lat,
            longitude: incident.responderCoordinates.lon,
          };
          setResponderCoords(newCoords);

          // Update map region to show both points
          if (incidentState?.location?.lat && incidentState?.location?.lon) {
            const midLat =
              (newCoords.latitude + incidentState.location.lat) / 2;
            const midLon =
              (newCoords.longitude + incidentState.location.lon) / 2;

            const latDelta =
              Math.abs(newCoords.latitude - incidentState.location.lat) * 1.5;
            const lonDelta =
              Math.abs(newCoords.longitude - incidentState.location.lon) * 1.5;

            setMapRegion({
              latitude: midLat,
              longitude: midLon,
              latitudeDelta: Math.max(latDelta, LATITUDE_DELTA),
              longitudeDelta: Math.max(lonDelta, LONGITUDE_DELTA),
            });
          }
        }
      } catch (error) {
        console.error("Error checking incident status:", error);
      }
    };

    const interval = setInterval(checkIncidentStatus, 3000);
    checkIncidentStatus();
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [incidentState]);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={28} color="#1B4965" />
      </TouchableOpacity>

      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={
          mapRegion || {
            latitude: 10.38029,
            longitude: 123.96444,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }
        }>
        {/* Incident Location Marker */}
        <Marker
          coordinate={{
            latitude: incidentState?.location?.lat || 10.3157,
            longitude: incidentState?.location?.lon || 123.8854,
          }}
          title="Incident Location"
          description={incidentState?.location?.address}
          pinColor="red"
        />
        {/* Responder Location Marker */}
        <Marker
          coordinate={responderCoords}
          title="Responder Location"
          description="Ambulance location"
          pinColor="blue"
        />
        {/* Directions between responder and incident */}
        // Inside your return statement, update the MapViewDirections component:
        <MapViewDirections
          origin={responderCoords}
          destination={{
            latitude: incidentState?.location?.lat || 10.3157,
            longitude: incidentState?.location?.lon || 123.8854,
          }}
          apikey={GOOGLE_MAPS_API_KEY!}
          strokeWidth={4}
          strokeColor="#1B4965"
          mode="DRIVING"
          optimizeWaypoints={true}
          onReady={(result) => {
            console.log("Directions ready:", result);
            setDistance(`${result.distance.toFixed(2)} km`);
            setDuration(`${Math.ceil(result.duration)} min`);
            setDirectionsError(null);
          }}
          onError={(errorMessage) => {
            console.error("Directions API error:", errorMessage);
            setDirectionsError(errorMessage);
          }}
        />
        {/* Add this below the MapView to show any errors */}
        {directionsError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Error: {directionsError}</Text>
          </View>
        )}
      </MapView>

      <View style={styles.bottomSheet}>
        <View style={styles.incidentCard}>
          <View style={styles.headerSection}>
            <View style={styles.headerRow}>
              <Image
                source={require("@/assets/images/AMBU.png")}
                resizeMode="contain"
                style={styles.logoImage}
              />
              <View style={styles.headerText}>
                <Text style={styles.ambulanceId}>AMBU 123</Text>
                <Text style={styles.address}>
                  Bantay Mandaue Command Center
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.etaContainer}>
            <View style={styles.etaStatus}>
              <Text style={styles.etaStatusText}>
                {formatResponderStatus(responderStatus)}
              </Text>
            </View>
            <View style={styles.etaDetails}>
              <View style={styles.etaItem}>
                <Text style={styles.etaLabel}>ETA</Text>
                <Text style={styles.etaValue}>{duration}</Text>
              </View>
              <View style={styles.etaItem}>
                <Text style={styles.etaLabel}>DIS</Text>
                <Text style={styles.etaValue}>{distance}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: width,
    height: height,
  },
  backButton: {
    position: "absolute",
    top: 30,
    left: 20,
    zIndex: 1,
    backgroundColor: "white",
    padding: 4,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 20,
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
  },
  incidentCard: {
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerSection: {
    padding: 15,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  ambulanceId: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ff6b6b",
  },
  address: {
    fontSize: 14,
    color: "#666",
  },
  etaContainer: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  etaStatus: {
    flex: 1,
    backgroundColor: "#1B4965",
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  etaStatusText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  etaDetails: {
    flex: 1,
    backgroundColor: "#1B4965",
    padding: 15,
    borderLeftWidth: 1,
    borderLeftColor: "white",
  },
  etaItem: {
    marginBottom: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  etaLabel: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  etaValue: {
    color: "#ff6b6b",
    fontWeight: "bold",
    fontSize: 14,
  },
  headerText: {
    flex: 1,
  },
  logoImage: {
    width: 50,
    height: 50,
  },
  errorContainer: {
    position: "absolute",
    top: 80,
    left: 20,
    right: 20,
    backgroundColor: "rgba(255, 0, 0, 0.7)",
    padding: 10,
    borderRadius: 5,
    zIndex: 1000,
  },
  errorText: {
    color: "white",
    fontWeight: "bold",
  },
});
