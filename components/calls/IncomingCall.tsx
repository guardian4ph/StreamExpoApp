import {StyleSheet, Text, View, TouchableOpacity, Modal} from "react-native";
import React from "react";
import {Ionicons} from "@expo/vector-icons";

type Props = {
  visible: boolean;
  callerName: string;
  onAccept: () => void;
  onReject: () => void;
};

export default function IncomingCall({
  visible,
  callerName,
  onAccept,
  onReject,
}: Props) {
  return (
    <Modal transparent visible={visible} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.popup}>
          <View style={styles.content}>
            <Ionicons name="videocam" size={50} color="#1B4965" />
            <Text style={styles.title}>Incoming Video Call</Text>
            <Text style={styles.caller}>{callerName}</Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.rejectButton} onPress={onReject}>
              <Ionicons name="close-circle" size={30} color="#fff" />
              <Text style={styles.buttonText}>Decline</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.acceptButton} onPress={onAccept}>
              <Ionicons name="checkmark-circle" size={30} color="#fff" />
              <Text style={styles.buttonText}>Accept</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  popup: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1B4965",
    marginTop: 20,
  },
  caller: {
    fontSize: 18,
    color: "#666",
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  acceptButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 30,
    padding: 15,
    alignItems: "center",
    width: 120,
  },
  rejectButton: {
    backgroundColor: "#f44336",
    borderRadius: 30,
    padding: 15,
    alignItems: "center",
    width: 120,
  },
  buttonText: {
    color: "#fff",
    marginTop: 5,
  },
});
