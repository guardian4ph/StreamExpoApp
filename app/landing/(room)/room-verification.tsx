import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Platform,
  ScrollView,
} from "react-native";
import React, {useEffect, useState, useRef} from "react";
import {useRouter} from "expo-router";
import GetIcon from "@/utils/GetIcon";
import {Ionicons} from "@expo/vector-icons";
import {StreamChat} from "stream-chat";
import {useAuth} from "@/context/AuthContext";
import InitialChatAlert from "@/components/InitialChatAlert";
import {useCalls, StreamCall} from "@stream-io/video-react-native-sdk";
import {useIncident} from "@/context/IncidentContext";
import CallPanel from "@/components/calls/CallPanel";
import CancelIncidentModal from "@/components/incidents/cancel-incident-modal";
import {useDispatcherDetails} from "@/hooks/useDispatcherDetails";
import formatResponderStatus from "@/utils/FormatResponderStatus";
import {useSound} from "@/utils/PlaySound";
import RingingSound from "@/components/calls/RingingSound";

export default function IncidentRoomVerification() {
  const {incidentState, clearIncident, setCurrentIncident} = useIncident();
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const {authState} = useAuth();
  const [elapsedTime, setElapsedTime] = useState<string>("00:00:00");
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [isAmbulanceComing, setIsAmbulanceComing] = useState<boolean>(false);
  const [initialMsg, setInitialMsg] = useState<string>("");
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatcher = useDispatcherDetails(incidentState?.dispatcher || null);
  const [responderStatus, setResponderStatus] = useState<string>("enroute");
  const router = useRouter();
  const calls = useCalls();
  const {playSound} = useSound(require("@/assets/sounds/sound_notif.mp3"));
  const hasPlayedVerificationSound = useRef(false);

  useEffect(() => {
    if (!incidentState || incidentState.channelId === "index") {
      router.replace("/landing/(room)");
      return;
    }
  }, [incidentState]);

  // realtym updates for incident status..
  useEffect(() => {
    let mounted = true;
    const checkIsIncidentResolved = async () => {
      if (!incidentState?.incidentId) return;
      try {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/incidents/${incidentState?.incidentId}`
        );
        const incident = await response.json();

        if (incident.isVerified && mounted) {
          if (!isVerified && !hasPlayedVerificationSound.current) {
            playSound();
            hasPlayedVerificationSound.current = true;
          }
          setIsVerified(true);
        }

        if (incident.isAcceptedResponder && mounted) {
          setIsAmbulanceComing(true);
        }

        if (
          incident.dispatcher &&
          (!incidentState.dispatcher ||
            incident.dispatcher !== incidentState.dispatcher)
        ) {
          console.log("Dispatcher assigned:", incident.dispatcher);
          const updatedIncident = {
            ...incidentState,
            dispatcher: incident.dispatcher,
          };
          await setCurrentIncident!(updatedIncident);
        }

        if (incident.responderStatus && mounted) {
          setResponderStatus(incident.responderStatus);
        }

        if (incident.isResolved && mounted) {
          clearInterval(interval);
          setIsLoading(true);
          try {
            await clearIncident!();
            setTimeout(() => {
              if (mounted) {
                router.replace("/landing/(room)");
              }
            }, 200);
          } catch (error) {
            console.error("Error during cleanup:", error);
            if (mounted) {
              setIsLoading(false);
            }
          }
          return;
        }
      } catch (error) {
        console.error("Error checking incident status:", error);
      }
    };
    const interval = setInterval(checkIsIncidentResolved, 3000);
    checkIsIncidentResolved();

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [incidentState]);

  // initiate incident timer counter
  useEffect(() => {
    const initialTime = Date.now();

    const timerInterval = setInterval(() => {
      const elapsed = Date.now() - initialTime;
      const hours = Math.floor(elapsed / (1000 * 60 * 60))
        .toString()
        .padStart(2, "0");
      const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60))
        .toString()
        .padStart(2, "0");
      const seconds = Math.floor((elapsed % (1000 * 60)) / 1000)
        .toString()
        .padStart(2, "0");
      setElapsedTime(`${hours}:${minutes}:${seconds}`);
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  useEffect(() => {
    const listenForInitialMessage = async () => {
      const hash = incidentState?.incidentId.substring(5, 9);
      const channelId = `${incidentState?.emergencyType.toLowerCase()}-${hash}`;
      try {
        const chatClient = StreamChat.getInstance(
          process.env.EXPO_PUBLIC_STREAM_ACCESS_KEY!
        );
        await chatClient.connectUser(
          {id: authState?.user_id!},
          authState?.token!
        );
        const channel = chatClient.channel("messaging", channelId);
        await channel.watch();

        const response = await channel.query({messages: {limit: 10}});
        const messages = response.messages || [];
        if (messages.length > 0) {
          const firstMessage = messages[0].text || "New message received";
          setInitialMsg(firstMessage);
          setShowPopup(true);
        }
      } catch (error) {
        console.error("Error listening for initial message:", error);
      }
    };

    if (incidentState?.channelId && authState?.user_id) {
      listenForInitialMessage();
    }
  }, [incidentState?.channelId, authState]);

  const handleReply = () => {
    setShowPopup(false);
    router.push({
      pathname: "/landing/(room)/[id]",
      params: {
        id: incidentState?.channelId as string,
      },
    });
  };

  // console.log("dispatcher: ", dispatcher);

  return (
    <SafeAreaView style={styles.safeArea}>
      <InitialChatAlert
        visible={showPopup}
        onClose={() => setShowPopup(false)}
        onReply={handleReply}
        message={initialMsg || "You have a new message from the operator."}
      />
      <CancelIncidentModal
        visible={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onSubmit={() => console.log("test cancel")}
      />
      {calls && calls.length > 0 && calls[0] ? (
        <StreamCall call={calls[0]}>
          <RingingSound />
          <CallPanel />
        </StreamCall>
      ) : null}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.innerContainer}>
          {/* Emergency Type Section with Timer */}
          <View style={styles.incidentCard}>
            <View style={styles.headerSection}>
              <View style={styles.headerRow}>
                <Image
                  source={GetIcon(incidentState?.emergencyType as string)}
                  resizeMode="contain"
                  style={styles.medicalIcon}
                />
                <View style={styles.headerText}>
                  <View style={styles.idSection}>
                    <Text style={styles.idLabel}>ID:</Text>
                    <Text style={styles.idNumber}>
                      {incidentState?.incidentId.substring(0, 18)}
                    </Text>
                  </View>
                  <Text style={styles.incidentType}>
                    {incidentState?.emergencyType} Incident
                  </Text>
                  <Text style={styles.address}>
                    {incidentState?.location?.address || "Location unavailable"}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.timerSection}>
              <Text style={styles.timerText}>RECEIVED: {elapsedTime}</Text>
            </View>
          </View>
          {/* verification status  */}
          <View style={styles.incidentCard}>
            <View style={styles.headerSection}>
              <View style={styles.headerRow}>
                <Image
                  source={require("@/assets/images/banner-icon.png")}
                  resizeMode="contain"
                  style={styles.logoImage}
                />
                <View style={styles.headerText}>
                  <View style={styles.statusRow}>
                    <View>
                      <Text
                        style={[
                          styles.verification,
                          isVerified
                            ? styles.verifiedText
                            : styles.unverifiedText,
                        ]}>
                        {isVerified ? "VERIFIED" : "UNVERIFIED"}
                      </Text>
                      <Text style={styles.address}>Incident Status</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.subHeading}>
              <Text style={{color: "white", textAlign: "center"}}>
                Sending nearest asset at the incident location...
              </Text>
            </View>

            {!isVerified ? (
              <View style={styles.headerSection}>
                <View style={styles.headerRow}>
                  <Image
                    source={require("@/assets/images/avatar.png")}
                    resizeMode="contain"
                    style={styles.logoImage}
                  />
                  <View style={styles.headerText}>
                    <View style={styles.statusRow}>
                      <View>
                        <Text
                          style={{
                            color: "#1B4965",
                            fontWeight: "bold",
                            fontSize: 18,
                          }}>
                          {dispatcher?.firstName}
                        </Text>
                        <Text>Dispatch Operator</Text>
                      </View>
                      <View style={styles.iconContainer}>
                        <Ionicons
                          name="mail"
                          size={30}
                          color={isLoading ? "#ccc" : "#1B4965"}
                          onPress={() => {
                            if (!isLoading) {
                              router.push({
                                pathname: "/landing/(room)/[id]",
                                params: {
                                  id: incidentState?.channelId as string,
                                },
                              });
                            }
                          }}
                        />
                        <Ionicons
                          name="videocam-sharp"
                          size={30}
                          color={isLoading ? "#ccc" : "#1B4965"}
                          onPress={() => {
                            if (!isLoading) {
                              router.push({
                                pathname: "/landing/(room)/video-call",
                                params: {
                                  id: incidentState?.channelId as string,
                                },
                              });
                            }
                          }}
                        />
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            ) : null}
          </View>

          {/*ambulance info */}
          {isAmbulanceComing && isVerified ? (
            <View style={styles.ambulanceContainer}>
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

                {/* ETA setcion */}
                <View style={styles.etaContainer}>
                  <View style={styles.etaStatus}>
                    <Text style={styles.etaStatusText}>
                      {formatResponderStatus(responderStatus)}
                    </Text>
                  </View>
                  <View style={styles.etaDetails}>
                    <View style={styles.etaItem}>
                      <Text style={styles.etaLabel}>ETA</Text>
                      <Text style={styles.etaValue}>4min</Text>
                    </View>
                    <View style={styles.etaItem}>
                      <Text style={styles.etaLabel}>DIS</Text>
                      <Text style={styles.etaValue}>600m</Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.mapButtonContainer}
                  onPress={() => router.push("/landing/(room)/map-view")}>
                  <Ionicons name="map" size={24} color="#1B4965" />
                  <Text style={styles.mapButtonText}>View Map</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}

          <TouchableOpacity
            style={[styles.cancelButtonContainer, isLoading && {opacity: 0.5}]}
            disabled={isLoading}
            onPress={() => setShowCancelModal(true)}>
            <Text style={styles.cancelButtonText}>Cancel Report</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f3f5f5",
  },
  scrollView: {
    flex: 1,
    width: "100%",
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: Platform.OS === "ios" ? 20 : 10,
  },
  innerContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    width: "100%",
    padding: 20,
    paddingBottom: 30,
  },
  ambulanceContainer: {
    marginBottom: 5,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  idSection: {
    flexDirection: "row",
    gap: 5,
    marginBottom: 5,
  },
  idLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  idNumber: {
    fontSize: 16,
  },
  incidentType: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4287f5",
    marginBottom: 5,
  },
  verification: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  verifiedText: {
    color: "green",
  },
  unverifiedText: {
    color: "red",
  },
  address: {
    fontSize: 14,
    color: "#666",
  },
  timerSection: {
    backgroundColor: "#ff6b6b",
    padding: 10,
  },
  timerText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  medicalIcon: {
    width: 50,
    height: 50,
  },
  headerText: {
    flex: 1,
  },
  logoImage: {
    width: 50,
    height: 50,
  },

  subHeading: {
    padding: 20,
    backgroundColor: "#1B4965",
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconContainer: {
    flexDirection: "row",
    gap: 15,
  },
  ambulanceId: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ff6b6b",
    marginBottom: 5,
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
    display: "flex",
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
  mapButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    gap: 10,
  },
  mapButtonText: {
    color: "#1B4965",
    fontSize: 16,
    fontWeight: "500",
  },
  cancelButtonContainer: {
    backgroundColor: "#ff6b6b",
    padding: 12,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 10,
  },
  cancelButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
