import {SafeAreaView, StyleSheet, Text, View, Image} from "react-native";
import React, {useEffect, useState} from "react";
import {useRouter, useLocalSearchParams} from "expo-router";
import getEmergencyIcon from "@/utils/GetIcon";
import {Ionicons} from "@expo/vector-icons";
import {StreamChat} from "stream-chat";
import {useAuth} from "@/context/AuthContext";
import InitialChatAlert from "@/components/InitialChatAlert";
import IncomingCall from "@/components/calls/IncomingCall";
import {
  CallingState,
  useCall,
  useCalls,
  useCallStateHooks,
} from "@stream-io/video-react-native-sdk";

export default function RoomVerification() {
  const {emergencyType, channelId, incidentId} = useLocalSearchParams();
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const {authState} = useAuth();
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [initialMsg, setInitialMsg] = useState<string>("");
  const [incomingCall, setIncomingCall] = useState<boolean>(false);
  const router = useRouter();

  // call properties
  const calls = useCalls();
  const {useCallCallingState} = useCallStateHooks();
  const callingState = useCallCallingState();
  const call = calls?.[0];
  const isCallCreatedByMe = call?.state.createdBy?.id === call?.currentUserId;

  useEffect(() => {
    if (callingState === CallingState.RINGING && !isCallCreatedByMe) {
      setIncomingCall(true);
    }
  }, [callingState, isCallCreatedByMe]);

  useEffect(() => {
    const listenForInitialMessage = async () => {
      try {
        const chatClient = StreamChat.getInstance(
          process.env.EXPO_PUBLIC_STREAM_ACCESS_KEY!
        );
        await chatClient.connectUser(
          {id: authState?.user_id!},
          authState?.token!
        );
        const channel = chatClient.channel("messaging", channelId as string);
        await channel.watch();
        setShowPopup(true);
      } catch (error) {
        console.error("Error listening for initial message:", error);
      }
    };

    if (channelId && authState?.user_id) {
      listenForInitialMessage();
    }
  }, [channelId, authState]);

  const handleReply = () => {
    setShowPopup(false);
    router.push({
      pathname: "/landing/(room)/[id]",
      params: {
        id: channelId as string,
      },
    });
  };

  const handleAcceptCall = () => {
    setIncomingCall(false);
    router.push({
      pathname: "/landing/(room)/VideoCall",
      params: {id: channelId as string},
    });
  };

  const handleRejectCall = () => {
    setIncomingCall(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <InitialChatAlert
        visible={showPopup}
        onClose={() => setShowPopup(false)}
        onReply={handleReply}
        message="Your report Medical Incident was received with a location at AS Fortuna St. Mandaue, can you verify the exact location, by giving us a landmark around you?"
      />
      <IncomingCall
        visible={incomingCall}
        callerName="Dispatch Operator"
        onAccept={handleAcceptCall}
        onReject={handleRejectCall}
      />
      <View style={styles.innerContainer}>
        {/* Emergency Type Section with Timer */}
        <View style={styles.incidentCard}>
          <View style={styles.headerSection}>
            <View style={styles.headerRow}>
              <Image
                source={getEmergencyIcon(emergencyType as string)}
                resizeMode="contain"
                style={styles.medicalIcon}
              />
              <View style={styles.headerText}>
                <View style={styles.idSection}>
                  <Text style={styles.idLabel}>ID:</Text>
                  <Text style={styles.idNumber}>25-03-11-0000</Text>
                </View>
                <Text style={styles.incidentType}>
                  {emergencyType} Incident
                </Text>
                <Text style={styles.address}>
                  A.S. Fortuna St, Mandaue City
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.timerSection}>
            <Text style={styles.timerText}>RECEIVED : </Text>
          </View>
        </View>
        {/* Verification Status with Dispatch Operator Details */}
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
                    <Text style={styles.verification}>
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
          <View style={styles.headerSection}>
            <View style={styles.headerRow}>
              <Image
                source={require("@/assets/images/avatar.jpg")}
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
                      nameOperator
                    </Text>
                    <Text>Dispatch Operator</Text>
                  </View>
                  <View style={styles.iconContainer}>
                    <Ionicons
                      name="mail"
                      size={30}
                      color="#1B4965"
                      onPress={() =>
                        router.push({
                          pathname: "/landing/(room)/[id]",
                          params: {
                            id: channelId as string,
                          },
                        })
                      }
                    />
                    <Ionicons
                      name="videocam-sharp"
                      size={30}
                      color="#1B4965"
                      onPress={() =>
                        router.push({
                          pathname: "/landing/(room)/VideoCall",
                          params: {
                            id: channelId as string,
                          },
                        })
                      }
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  innerContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    width: "100%",
    padding: 30,
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
    color: "red",
    marginBottom: 5,
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
});
