import {Ionicons} from "@expo/vector-icons";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
} from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  onReply: () => void;
  message: string;
};

export default function InitialChatAlert({
  visible,
  onClose,
  onReply,
  message,
}: Props) {
  return (
    <Modal transparent visible={visible} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.popup}>
          <View style={styles.header}>
            <Text style={styles.title}>New Message</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#1B4965" />
            </TouchableOpacity>
          </View>

          <View style={styles.messageContainer}>
            <View style={styles.messageHeader}>
              {/* <Ionicons
                name="person-circle-outline"
                size={24}
                color="#1B4965"
              /> */}
              <Image
                source={require("@/assets/images/userAvatar.png")}
                style={styles.avatar}
              />
              <Text style={styles.sender}>Dispatch Operator</Text>
            </View>
            <Text style={styles.message}>{message}</Text>
          </View>

          <TouchableOpacity style={styles.replyButton} onPress={onReply}>
            <Ionicons name="chatbubble-outline" size={20} color="#fff" />
            <Text style={styles.replyText}>Reply</Text>
          </TouchableOpacity>
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
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1B4965",
  },
  messageContainer: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  messageHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 10,
  },
  sender: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1B4965",
  },
  message: {
    fontSize: 15,
    color: "#333",
    lineHeight: 20,
  },
  replyButton: {
    backgroundColor: "#1B4965",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    gap: 10,
  },
  replyText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});
