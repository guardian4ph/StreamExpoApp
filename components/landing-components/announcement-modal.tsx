import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import React from "react";
import {Ionicons} from "@expo/vector-icons";
import {Announcement} from "@/types/Announcement";

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
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <Text style={styles.title}>{announcement.title}</Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color="#1B4965" />
              </TouchableOpacity>
            </View>

            {announcement.image && (
              <Image
                source={{uri: imageUrl}}
                style={styles.image}
                resizeMode="cover"
              />
            )}

            <Text style={styles.message}>{announcement.message}</Text>
          </View>
        </View>
      </View>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1B4965",
  },
  image: {
    width: "100%",
    height: 200,
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
    backgroundColor: "#1B4965",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
