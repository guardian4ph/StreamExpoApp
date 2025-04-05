import {
  View,
  StyleSheet,
  Share,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, {useState, useEffect, useRef} from "react";

import Spinner from "react-native-loading-spinner-overlay";
import {useLocalSearchParams, useRouter, useNavigation} from "expo-router";
import Toast from "react-native-toast-message";
import CustomCallControls from "../../../components/CustomCallControls";
import CustomTopView from "../../../components/CustomTopView";
import ChatView from "@/components/ChatView";
import CustomBottomSheet from "@/components/CustomBottomSheet";
import {Ionicons} from "@expo/vector-icons";
import {useIncident} from "@/context/IncidentContext";

// const WIDTH = Dimensions.get("window").width;
// const HEIGHT = Dimensions.get("window").height;

const ChatPage = () => {
  const {id} = useLocalSearchParams<{id: string}>();
  const router = useRouter();
  const navigation = useNavigation();
  const {incidentState} = useIncident();

  const hasRedirected = useRef(false);

  useEffect(() => {
    if (!incidentState && id !== "index" && !hasRedirected.current) {
      console.log(
        "No incident state present... redirecting to Emergency Selection Page"
      );
      hasRedirected.current = true;
      router.replace("/landing/(room)/index");
    }
  }, [incidentState, id]);

  return (
    <View style={{flex: 1}}>
      <View style={styles.container}>
        <View style={styles.videoContainer}>
          <ChatView channelId={id} />
        </View>
      </View>
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
    flexDirection: "column",
  },
  chatContainer: {
    flex: 1,
    backgroundColor: "#fff",
    textAlign: "center",
    justifyContent: "center",
  },
});

export default ChatPage;
