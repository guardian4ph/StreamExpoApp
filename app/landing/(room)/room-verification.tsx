import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Platform,
  ScrollView,
  AppState,
} from "react-native";
import React, {useEffect, useState, useRef, useMemo} from "react";
import {useRouter} from "expo-router";
import GetIcon from "@/utils/GetIcon";
import {StreamChat} from "stream-chat";
import InitialChatAlert from "@/components/InitialChatAlert";
import {useCalls, StreamCall} from "@stream-io/video-react-native-sdk";
import {useIncidentStore} from "@/context/useIncidentStore";
import CallPanel from "@/components/calls/CallPanel";
import CancelIncidentModal from "@/components/incidents/cancel-incident-modal";
import {useSound} from "@/utils/PlaySound";
import * as SecureStore from "expo-secure-store";
import {useAuthStore} from "@/context/useAuthStore";
import {useFetchIncident} from "@/api/incidents/useFetchIncident";
import IncidentDispatcherSection from "@/components/incidents/incident-dispatcher-section";
import IncidentResponderSection from "@/components/incidents/incident-responder-section";

export default function IncidentRoomVerification() {
  const {incidentState, clearActiveIncident, setCurrentIncident} =
    useIncidentStore();
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<string>("00:00:00");
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [isAmbulanceComing, setIsAmbulanceComing] = useState<boolean>(false);
  const [initialMsg, setInitialMsg] = useState<string>("");
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false);
  const [responderStatus, setResponderStatus] = useState<string>("enroute");
  const router = useRouter();
  const calls = useCalls();
  const {playSound} = useSound(require("@/assets/sounds/sound_notif.mp3"));
  const {data: incident} = useFetchIncident(incidentState?._id || "");

  useEffect(() => {
    if (!incidentState || incidentState.channelId === "index") {
      router.replace("/landing/(room)");
      return;
    }
  }, [incidentState]);

  useEffect(() => {
    if (!incident || !incidentState) return;

    if (incident.isVerified && !isVerified) {
      const soundPlayedKey = `sound_played_${incidentState._id.substring(
        5,
        9
      )}`;
      const soundPlayed = SecureStore.getItemAsync(soundPlayedKey);
      if (!soundPlayed) {
        playSound();
        SecureStore.setItemAsync(soundPlayedKey, "true");
      }
      setIsVerified(true);
    }

    // Handle ambulance status
    if (incident.isAcceptedResponder && !isAmbulanceComing) {
      setIsAmbulanceComing(true);
    }

    // Only update incident state if there are actual changes
    const hasChanges =
      (incident.dispatcher &&
        incident.dispatcher !== incidentState.dispatcher) ||
      (incident.responderStatus &&
        incident.responderStatus !== incidentState.responderStatus) ||
      (incident.opCen && incident.opCen !== incidentState.opCen);

    if (hasChanges) {
      const updatedIncident = {
        ...incidentState,
        ...(incident.dispatcher && {dispatcher: incident.dispatcher}),
        ...(incident.responderStatus && {
          responderStatus: incident.responderStatus,
          responder: incident.responder,
        }),
        ...(incident.opCen && {opCen: incident.opCen}),
      };
      setCurrentIncident(updatedIncident);
    }

    if (incident.isFinished) {
      try {
        const soundPlayedKey = `sound_played_${incidentState._id.substring(
          5,
          9
        )}`;
        const popupShownKey = `popup_shown_${incidentState._id.substring(
          5,
          9
        )}`;
        Promise.all([
          SecureStore.deleteItemAsync(soundPlayedKey),
          SecureStore.deleteItemAsync(popupShownKey),
        ]);
        clearActiveIncident();
        setTimeout(() => {
          router.replace("/landing/(room)");
        }, 200);
      } catch (error) {
        console.error("Error during cleanup:", error);
      }
    }
  }, [
    incident,
    isVerified,
    playSound,
    clearActiveIncident,
    router,
    setCurrentIncident,
  ]);

  // running time function
  useEffect(() => {
    const initialTime = Date.now();
    let mounted = true;

    const timerInterval = setInterval(() => {
      if (!mounted) return;

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

    return () => {
      mounted = false;
      clearInterval(timerInterval);
    };
  }, []);

  // const listenForInitialMessage = useMemo(() => {
  //   return async () => {
  //     if (!incidentState?._id) return;

  //     const popupShownKey = `popup_shown_${incidentState._id.substring(5, 9)}`;
  //     const popupShown = await SecureStore.getItemAsync(popupShownKey);
  //     // if popup has been shown and naa sa secureStore, do not show anymore.
  //     if (popupShown) return;

  //     const hash = incidentState?._id.substring(5, 9);
  //     const channelId = `${incidentState?.incidentType.toLowerCase()}-${hash}`;
  //     try {
  //       const chatClient = StreamChat.getInstance(
  //         process.env.EXPO_PUBLIC_STREAM_ACCESS_KEY!
  //       );
  //       await chatClient.connectUser({id: user_id!}, token);
  //       const channel = chatClient.channel("messaging", channelId);
  //       await channel.watch();

  //       const response = await channel.query({messages: {limit: 10}});
  //       const messages = response.messages || [];
  //       if (messages.length > 0) {
  //         const firstMessage = messages[0].text || "New message received";
  //         setInitialMsg(firstMessage);
  //         setShowPopup(true);
  //         await SecureStore.setItemAsync(popupShownKey, "true");
  //       }
  //     } catch (error) {
  //       console.error("Error listening for initial message:", error);
  //     }
  //   };
  // }, [incidentState?._id, user_id, token]);

  // useEffect(() => {
  //   if (incidentState?.channelId && user_id) {
  //     listenForInitialMessage();
  //   }
  // }, [incidentState?.channelId, user_id, listenForInitialMessage]);

  const handleReply = () => {
    setShowPopup(false);
    router.push({
      pathname: "/landing/(room)/[id]",
      params: {
        id: incidentState?.channelId as string,
      },
    });
  };

  return (
    <>
      {calls && calls.length > 0 && calls[0] ? (
        <View style={styles.callContainer}>
          <StreamCall call={calls[0]}>
            {/* <RingingSound /> */}
            <CallPanel />
          </StreamCall>
        </View>
      ) : null}
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
                    source={GetIcon(incidentState?.incidentType as string)}
                    resizeMode="contain"
                    style={styles.medicalIcon}
                  />
                  <View style={styles.headerText}>
                    <View style={styles.idSection}>
                      <Text style={styles.idLabel}>ID:</Text>
                      <Text style={styles.idNumber}>
                        {incidentState?._id.substring(0, 18)}
                      </Text>
                    </View>
                    <Text style={styles.incidentType}>
                      {incidentState?.incidentType} Incident
                    </Text>
                    <Text style={styles.address}>
                      {incidentState?.incidentDetails?.location ||
                        "Location unavailable"}
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
                <IncidentDispatcherSection incidentState={incidentState} />
              ) : null}
            </View>

            {/*ambulance info */}
            {isAmbulanceComing && isVerified && (
              <IncidentResponderSection incidentState={incidentState} />
            )}
          </View>
        </ScrollView>

        <View style={styles.cancelButtonWrapper}>
          <TouchableOpacity
            style={[
              styles.cancelButtonContainer,
              showCancelModal && styles.disabledButton,
            ]}
            onPress={() => setShowCancelModal(true)}
            disabled={showCancelModal}>
            <Text style={styles.cancelButtonText}>
              {showCancelModal ? "Cancelling..." : "Cancel Report"}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
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
  callContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    margin: 0,
    padding: 0,
    zIndex: 9999,
  },
  cancelButtonWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#f3f5f5",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  cancelButtonContainer: {
    backgroundColor: "#ff6b6b",
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#cccccc",
  },
});
