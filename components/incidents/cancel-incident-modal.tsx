import {
  StyleSheet,
  Text,
  View,
  Modal,
  TextInput,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React, {useState} from "react";
import {useIncidentStore} from "@/context/useIncidentStore";

interface CancelIncidentModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}

export default function CancelIncidentModal({
  visible,
  onClose,
  onSubmit,
}: CancelIncidentModalProps) {
  const [reason, setReason] = useState("");
  const {clearIncident} = useIncidentStore();

  const handleSubmit = () => {
    clearIncident!();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>CANCEL REPORT</Text>
            <Text style={styles.warning}>
              GuardianPH may suspend your account if the reason is deemed
              invalid. See use policy.
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Not more than 200 words."
              multiline
              numberOfLines={4}
              maxLength={200}
              value={reason}
              onChangeText={setReason}
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSubmit}
              disabled={!reason.trim()}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
  modalContent: {
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ff6b6b",
    marginBottom: 10,
  },
  warning: {
    textAlign: "center",
    color: "#666",
    marginBottom: 20,
    fontSize: 14,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    height: 250,
    textAlignVertical: "top",
    marginBottom: 20,
  },
  sendButton: {
    backgroundColor: "#1B4965",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    opacity: 1,
  },
  sendButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
