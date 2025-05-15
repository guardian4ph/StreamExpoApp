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
import {useIncidentStore} from "@/context/useIncidentStore";
import {Ionicons} from "@expo/vector-icons";
import {useRouter} from "expo-router";
import formatResponderStatus from "@/utils/FormatResponderStatus";
import GetEmergencyIcon from "@/utils/GetEmergencyIcon";
import GetIcon from "@/utils/GetIcon";

const {width, height} = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.005;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

export default function MapViewScreen() {
  const {incidentState} = useIncidentStore();
  const [responderStatus, setResponderStatus] = useState(
    incidentState?.responderStatus || "enroute"
  );
  const [distance, setDistance] = useState<string>("--");
  const [duration, setDuration] = useState<string>("--");
  const [mapRegion, setMapRegion] = useState<Region | null>(null);
  const [directionsError, setDirectionsError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const mapRef = useRef<MapView>(null);
  const router = useRouter();
  const incidentIdRef = useRef(incidentState?.incidentId);
  const fetchIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);
  const [hospitalCoords, setHospitalCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [isRoutingToHospital, setIsRoutingToHospital] =
    useState<boolean>(false);

  const hospitalIcon = useMemo(() => {
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
    if (!incidentState?.location?.lat || !incidentState?.location?.lon) {
      return null;
    }
    return {
      latitude: incidentState.location.lat,
      longitude: incidentState.location.lon,
    };
  }, [incidentState?.location?.lat, incidentState?.location?.lon]);

  const emergencyIcon = useMemo(() => {
    return GetEmergencyIcon(incidentState?.incidentType || "");
  }, [incidentState?.incidentType]);

  const responderIcon = useMemo(() => {
    return GetIcon(incidentState?.incidentType || "");
  }, [incidentState?.incidentType]);

  const formattedResponderStatus = useMemo(() => {
    return formatResponderStatus(responderStatus);
  }, [responderStatus]);

  // initialize map func
  const initializeMap = useCallback(async () => {
    if (!isMountedRef.current) return;

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
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
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
            isRoutingToHospital && hospitalCoords
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
  }, [incidentCoords, isLoading, isRoutingToHospital, hospitalCoords]);

  // to check 4 status changes (enroute, onscene, etfc)..
  const checkIncidentStatus = useCallback(async () => {
    if (!incidentState?.incidentId || !isMountedRef.current) return;

    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/incidents/${incidentState.incidentId}`
      );
      const incident = await response.json();

      if (!incident || !incident.responderStatus) return;

      if (!isMountedRef.current) return;

      if (
        incident.responderStatus &&
        incident.responderStatus !== responderStatus
      ) {
        setResponderStatus(incident.responderStatus);
      }

      if (incident.selectedHospital) {
        if (
          incident.selectedHospital &&
          incident.selectedHospital.coordinates
        ) {
          const hospitalLocation = {
            latitude: incident.selectedHospital.coordinates.lat,
            longitude: incident.selectedHospital.coordinates.lng,
          };

          setHospitalCoords(hospitalLocation);
          setIsRoutingToHospital(true);
        } else {
          try {
            const hospitalResponse = await fetch(
              `${process.env.EXPO_PUBLIC_API_URL}/hospitals/${incident.selectedHospital}`
            );
            const hospitalData = await hospitalResponse.json();

            if (hospitalData.coordinates) {
              const hospitalLocation = {
                latitude: hospitalData.coordinates.lat,
                longitude: hospitalData.coordinates.lng,
              };

              setHospitalCoords(hospitalLocation);
              setIsRoutingToHospital(true);
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
          if (isRoutingToHospital && hospitalCoords && incidentCoords) {
            const midLat =
              (hospitalCoords.latitude + incidentCoords.latitude) / 2;
            const midLon =
              (hospitalCoords.longitude + incidentCoords.longitude) / 2;

            const latDelta =
              Math.abs(hospitalCoords.latitude - incidentCoords.latitude) * 1.5;
            const lonDelta =
              Math.abs(hospitalCoords.longitude - incidentCoords.longitude) *
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
    incidentState?.incidentId,
    responderStatus,
    mapRegion,
    incidentCoords,
    responderCoords,
    hospitalCoords,
    isRoutingToHospital,
  ]);

  const handleDirectionsReady = useCallback(
    (result: any) => {
      if (!isMountedRef.current) return;

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

  const handleDirectionsError = useCallback((errorMessage: any) => {
    console.error("Directions API error:", errorMessage);
    if (isMountedRef.current) {
      setDirectionsError(errorMessage);
    }
  }, []);

  useEffect(() => {
    initializeMap();
  }, [initializeMap]);

  useEffect(() => {
    isMountedRef.current = true;

    if (incidentIdRef.current !== incidentState?.incidentId) {
      if (fetchIntervalRef.current) {
        clearInterval(fetchIntervalRef.current);
      }
      incidentIdRef.current = incidentState?.incidentId;
    }

    checkIncidentStatus();

    fetchIntervalRef.current = setInterval(checkIncidentStatus, 3000);

    return () => {
      isMountedRef.current = false;
      if (fetchIntervalRef.current) {
        clearInterval(fetchIntervalRef.current);
        fetchIntervalRef.current = null;
      }
    };
  }, [incidentState?.incidentId, checkIncidentStatus]);

  const handleBackPress = useCallback(() => {
    router.back();
  }, [router]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading map...</Text>
      </View>
    );
  }

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
        {incidentCoords && !isRoutingToHospital && (
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

        {/* Hospital markre */}
        {hospitalCoords && (
          <Marker
            identifier="hospital"
            coordinate={hospitalCoords}
            title="Hospital"
            description="Destination Hospital"
            anchor={{x: 0.5, y: 0.5}}>
            <View style={styles.markerWrapper}>
              <Image source={hospitalIcon} style={styles.markerIcon} />
            </View>
          </Marker>
        )}

        {/* directions lines */}
        {incidentCoords && (
          <MapViewDirections
            origin={responderCoords}
            destination={isRoutingToHospital ? hospitalCoords! : incidentCoords}
            apikey={GOOGLE_MAPS_API_KEY!}
            strokeWidth={4}
            strokeColor={isRoutingToHospital ? "#ff6b6b" : "#1B4965"}
            mode="DRIVING"
            optimizeWaypoints={true}
            onReady={handleDirectionsReady}
            onError={handleDirectionsError}
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
                  {isRoutingToHospital
                    ? "En Route to Hospital"
                    : "Bantay Mandaue Command Center"}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.etaContainer}>
            <View style={styles.etaStatus}>
              <Text style={styles.etaStatusText}>
                {isRoutingToHospital ? "TO HOSPITAL" : formattedResponderStatus}
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
