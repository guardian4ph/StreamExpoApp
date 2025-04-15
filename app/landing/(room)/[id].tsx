import {View, StyleSheet} from "react-native";
import React from "react";
import Spinner from "react-native-loading-spinner-overlay";
import ChatView from "@/components/ChatView";
import {useIncident} from "@/context/IncidentContext";
import {useLocalSearchParams} from "expo-router";

// const WIDTH = Dimensions.get("window").width;
// const HEIGHT = Dimensions.get("window").height;

const ChatPage = () => {
  const {incidentState} = useIncident();

  const hash = incidentState?.incidentId.substring(5, 9);
  const id = `${incidentState?.emergencyType}-${hash}`;

  return (
    <View style={{flex: 1}}>
      <View style={styles.container}>
        <View style={styles.videoContainer}>
          <ChatView channelId={id!} />
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
