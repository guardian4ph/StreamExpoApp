import {
  View,
  StyleSheet,
  Share,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import {
  Call,
  CallContent,
  StreamCall,
  useStreamVideoClient,
} from "@stream-io/video-react-native-sdk";
import Spinner from "react-native-loading-spinner-overlay";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";

import CustomCallControls from "../../../components/CustomCallControls";
import CustomTopView from "../../../components/CustomTopView";
import { reactions } from "../../../components/CustomCallControls";
import ChatView from "@/components/ChatView";
import CustomBottomSheet from "@/components/CustomBottomSheet";
import { Ionicons } from "@expo/vector-icons";

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

const Page = () => {
  const [call, setCall] = useState<Call | null>(null);

  const client = useStreamVideoClient();
  const { id } = useLocalSearchParams<{ id: string }>();

  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={shareMeeting}>
          <Ionicons name="share-outline" size={24} color={"#fff"} />
        </TouchableOpacity>
      ),
    });
  }, []);

  useEffect(() => {
    if (!client || call) return;

    const joinCall = async () => {
      console.log("Joining Call with id", id);
      const call = client.call("default", id);
      await call.join({ create: true });
      setCall(call);
    };

    joinCall();
  }, [client]);

  // Navigate back home on hangup
  const goToHomeScreen = async () => {
    router.back();
  };

  // Share the meeting link
  const shareMeeting = async () => {
    Share.share({
      message: `Join my meeting: myapp://(inside)/(room)/${id}`,
    });
  };
  if (!call) return null;

  return (
    <View style={{ flex: 1 }}>
      <Spinner visible={!call} />
      <StreamCall call={call}>
        <View style={styles.container}>
          <CallContent
            CallControls={CustomCallControls}
            onHangupCallHandler={goToHomeScreen}
            layout="grid"
            CallParticipantsList={CustomTopView}
          />

          {WIDTH > HEIGHT ? (
            <View style={styles.videoContainer}>
              <ChatView channelId={id} />
            </View>
          ) : (
            <CustomBottomSheet channelId={id} />
          )}
        </View>
      </StreamCall>
    </View>
  );
};
const styles = StyleSheet.create({
  videoContainer: {
    flex: 1,
    justifyContent: "center",
    textAlign: "center",
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    flexDirection: WIDTH > HEIGHT ? "row" : "column",
  },
  chatContainer: {
    flex: 1,
    backgroundColor: "#fff",
    textAlign: "center",
    justifyContent: "center",
  },
});

export default Page;
