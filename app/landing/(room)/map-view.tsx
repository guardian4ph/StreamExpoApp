import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  Image,
  ActivityIndicator,
  Platform,
} from "react-native";
import React, {useState, useEffect, useRef, useMemo, useCallback} from "react";
import MapView, {Marker, PROVIDER_GOOGLE, Region} from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import GetEmergencyIcon from "@/utils/GetEmergencyIcon";
import GetIcon from "@/utils/GetIcon";
import {useIncidentStore} from "@/context/useIncidentStore";
import {Ionicons} from "@expo/vector-icons";
import {useRouter} from "expo-router";
import IncidentResponderSection from "@/components/incidents/incident-responder-section";

const {width, height} = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.005;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

export default function MapViewScreen() {
  const {incidentState} = useIncidentStore();
  const [distance, setDistance] = useState<string>("--");
  const [duration, setDuration] = useState<string>("--");
  const [mapRegion, setMapRegion] = useState<Region | null>(null);
  const [directionsError, setDirectionsError] = useState<string | null>(null);
  const mapRef = useRef<MapView>(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [facilityCoords, setFacilityCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [isRoutingToFacility, setisRoutingToFacility] =
    useState<boolean>(false);

  const facilityIcon = useMemo(() => {
    return require("@/assets/images/hospital.png");
  }, []);

  const responderCoords = useMemo(
    () => ({
      latitude: 10.373,
      longitude: 123.9545,
    }),
    []
  );

  const incidentCoords = useMemo(() => {
    if (
      !incidentState?.incidentDetails?.coordinates?.lat ||
      !incidentState?.incidentDetails?.coordinates?.lon
    ) {
      return null;
    }
    return {
      latitude: incidentState.incidentDetails.coordinates.lat,
      longitude: incidentState.incidentDetails.coordinates.lon,
    };
  }, [
    incidentState?.incidentDetails?.coordinates?.lat,
    incidentState?.incidentDetails?.coordinates?.lon,
  ]);

  const emergencyIcon = useMemo(() => {
    return GetEmergencyIcon(incidentState?.incidentType || "");
  }, [incidentState?.incidentType]);

  const responderIcon = useMemo(() => {
    return GetIcon(incidentState?.incidentType || "");
  }, [incidentState?.incidentType]);

  // initialize map func
  const initializeMap = useCallback(async () => {
    try {
      setIsLoading(true);

      if (!incidentCoords) {
        setIsLoading(false);
        return;
      }

      const userCoords = incidentCoords;

      const midLat = (userCoords.latitude + responderCoords.latitude) / 2;
      const midLon = (userCoords.longitude + responderCoords.longitude) / 2;

      const latDelta =
        Math.abs(userCoords.latitude - responderCoords.latitude) * 1.2;
      const lonDelta =
        Math.abs(userCoords.longitude - responderCoords.longitude) * 1.2;

      const minLatDelta = 0.005;
      const minLonDelta = minLatDelta * ASPECT_RATIO;

      setMapRegion({
        latitude: midLat,
        longitude: midLon,
        latitudeDelta: Math.max(latDelta, minLatDelta),
        longitudeDelta: Math.max(lonDelta, minLonDelta),
      });
    } catch (error) {
      console.error("Error initializing map:", error);
    }
  }, [incidentCoords, responderCoords]);

  useEffect(() => {
    initializeMap();
  }, [initializeMap]);

  useEffect(() => {
    if (mapRef.current && incidentCoords && !isLoading) {
      const timer = setTimeout(() => {
        if (mapRef.current && incidentCoords) {
          const markers =
            isRoutingToFacility && facilityCoords
              ? ["incident", "responder", "hospital"]
              : ["incident", "responder"];

          mapRef.current.fitToSuppliedMarkers(markers, {
            edgePadding: {top: 50, right: 50, bottom: 50, left: 50},
            animated: true,
          });
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [incidentCoords, isLoading, isRoutingToFacility, facilityCoords]);

  // to check 4 status changes (enroute, onscene, etfc)..
  const checkIncidentStatus = useCallback(async () => {
    if (!incidentState?._id) return;

    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/incidents/${incidentState._id}`
      );
      const incident = await response.json();

      if (!incident || !incident.responderStatus) return;

      if (incident.selectedFacility) {
        if (
          incident.selectedFacility &&
          incident.selectedFacility.location.coordinates
        ) {
          const hospitalLocation = {
            latitude: incident.selectedFacility.location.coordinates.lat,
            longitude: incident.selectedFacility.location.coordinates.lng,
          };

          setFacilityCoords(hospitalLocation);
          setisRoutingToFacility(true);
        } else {
          try {
            const hospitalResponse = await fetch(
              `${process.env.EXPO_PUBLIC_API_URL}/facilities/${incident.selectedFacility}`
            );
            const hospitalData = await hospitalResponse.json();

            if (hospitalData.location.coordinates) {
              const hospitalLocation = {
                latitude: hospitalData.location.coordinates.lat,
                longitude: hospitalData.location.coordinates.lng,
              };

              setFacilityCoords(hospitalLocation);
              setisRoutingToFacility(true);
            }
          } catch (hospitalError) {
            console.error("Error fetching hospital data:", hospitalError);
          }
        }
      }

      if (incident.responderCoordinates && mapRegion && incidentCoords) {
        const newCoords = {
          latitude: incident.responderCoordinates.lat,
          longitude: incident.responderCoordinates.lon,
        };

        const coordsChanged =
          Math.abs(newCoords.latitude - responderCoords.latitude) > 0.0001 ||
          Math.abs(newCoords.longitude - responderCoords.longitude) > 0.0001;

        if (coordsChanged) {
          if (isRoutingToFacility && facilityCoords && incidentCoords) {
            const midLat =
              (facilityCoords.latitude + incidentCoords.latitude) / 2;
            const midLon =
              (facilityCoords.longitude + incidentCoords.longitude) / 2;

            const latDelta =
              Math.abs(facilityCoords.latitude - incidentCoords.latitude) * 1.5;
            const lonDelta =
              Math.abs(facilityCoords.longitude - incidentCoords.longitude) *
              1.5;

            setMapRegion({
              latitude: midLat,
              longitude: midLon,
              latitudeDelta: Math.max(latDelta, LATITUDE_DELTA),
              longitudeDelta: Math.max(lonDelta, LONGITUDE_DELTA),
            });
          } else {
            const midLat = (newCoords.latitude + incidentCoords.latitude) / 2;
            const midLon = (newCoords.longitude + incidentCoords.longitude) / 2;

            const latDelta =
              Math.abs(newCoords.latitude - incidentCoords.latitude) * 1.5;
            const lonDelta =
              Math.abs(newCoords.longitude - incidentCoords.longitude) * 1.5;

            setMapRegion({
              latitude: midLat,
              longitude: midLon,
              latitudeDelta: Math.max(latDelta, LATITUDE_DELTA),
              longitudeDelta: Math.max(lonDelta, LONGITUDE_DELTA),
            });
          }
        }
      }
    } catch (error) {
      console.error("Error checking incident status:", error);
    }
  }, [
    incidentState?._id,
    mapRegion,
    incidentCoords,
    responderCoords,
    facilityCoords,
    isRoutingToFacility,
  ]);

  const handleDirectionsReady = useCallback(
    (result: any) => {
      const newDistance = `${result.distance.toFixed(2)} km`;
      const newDuration = `${Math.ceil(result.duration)} min`;

      if (distance !== newDistance) {
        setDistance(newDistance);
      }

      if (duration !== newDuration) {
        setDuration(newDuration);
      }

      setDirectionsError(null);
    },
    [distance, duration]
  );

  useEffect(() => {
    initializeMap();
  }, [initializeMap]);

  if (!isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading map...</Text>
      </View>
    );
  }

  const handleBackPress = useCallback(() => {
    router.back();
  }, [router]);

  // #actual MAP UI VIEW
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <Ionicons name="arrow-back" size={28} color="#1B4965" />
      </TouchableOpacity>

      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={mapRegion!}
        showsUserLocation={true}
        showsMyLocationButton={true}
        loadingEnabled={true}
        loadingIndicatorColor="#3498db"
        loadingBackgroundColor="#f9f9f9">
        {/* incident Marker (VOLUNTEER USER) */}
        {incidentCoords && !isRoutingToFacility && (
          <Marker
            identifier="incident"
            coordinate={incidentCoords}
            title="Incident Location"
            description="You are Here!"
            anchor={{x: 0.5, y: 0.5}}>
            <View style={styles.markerWrapper}>
              <Image source={emergencyIcon} style={styles.markerIcon} />
            </View>
          </Marker>
        )}

        {/* responder marker */}
        <Marker
          identifier="responder"
          coordinate={responderCoords}
          title="Responder Location"
          description="Responder"
          anchor={{x: 0.5, y: 0.5}}>
          <View style={styles.markerWrapper}>
            <Image source={responderIcon} style={styles.markerIcon} />
          </View>
        </Marker>

        {/* FAacility markre */}
        {facilityCoords && (
          <Marker
            identifier="hospital"
            coordinate={facilityCoords}
            title="Hospital"
            description="Destination Hospital"
            anchor={{x: 0.5, y: 0.5}}>
            <View style={styles.markerWrapper}>
              <Image source={facilityIcon} style={styles.markerIcon} />
            </View>
          </Marker>
        )}

        {/* directions lines */}
        {incidentCoords && (
          <MapViewDirections
            origin={responderCoords}
            destination={isRoutingToFacility ? facilityCoords! : incidentCoords}
            apikey={GOOGLE_MAPS_API_KEY!}
            strokeWidth={4}
            strokeColor={isRoutingToFacility ? "#ff6b6b" : "#1B4965"}
            mode="DRIVING"
            optimizeWaypoints={true}
            onReady={handleDirectionsReady}
          />
        )}

        {/* err handling */}
        {directionsError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Error: {directionsError}</Text>
          </View>
        )}
      </MapView>

      <View style={styles.bottomSheet}>
        <IncidentResponderSection incidentState={incidentState} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  container: {
    flex: 1,
  },
  markerWrapper: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  markerIcon: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
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
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "transparent",
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
});
