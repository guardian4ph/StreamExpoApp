import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Announcement } from "@/types/Announcement";

interface AnnouncementModalProps {
  visible: boolean;
  onClose: () => void;
  announcement: Announcement | null;
}

export default function AnnouncementModal({
  visible,
  onClose,
  announcement,
}: AnnouncementModalProps) {
  if (!announcement) return null;

  // Construct the full image URL
  const imageUrl = announcement.image.startsWith("http")
    ? announcement.image
    : `${process.env.EXPO_PUBLIC_API_URL}${announcement.image}`;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <TouchableOpacity style={styles.overlay} onPress={onClose}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* <Text style={styles.title}>{announcement.title}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity> */}

            {announcement.image && (
              <Image
                source={{ uri: imageUrl }}
                style={styles.image}
                resizeMode="contain"
              />
            )}

            {/* <Text style={styles.message}>{announcement.message}</Text> */}
          </View>
        </View>
      </TouchableOpacity>
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
    height: "70%",
    // backgroundColor: "rgba(33, 90, 117, 0.7)",
    borderRadius: 5,
    // padding: 10,
    overflow: "hidden",
  },
  modalContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative", // important for absolute child
  },

  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#215a75",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    marginBottom: 15,
  },
  message: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
    marginBottom: 20,
    textAlign: "center",
  },

  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(236, 241, 244, 0.5)",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    zIndex: 999,
  },
});
