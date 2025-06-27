import {View, StyleSheet, StatusBar} from "react-native";
import React, {useState, useEffect} from "react";
import AlertPost from "@/components/landing-components/AlertPost";
import {useAuthStore} from "@/context/useAuthStore";
import {useGetAnnouncement} from "@/api/announcements/useGetAnnouncement";
import AnnouncementModal from "@/components/landing-components/announcement-modal";

const Landing = () => {
  const {user_id} = useAuthStore();
  const {data: announcement} = useGetAnnouncement(user_id || "");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (announcement) {
      setShowModal(true);
    }
  }, [announcement]);

  const handleCloseAnnouncement = () => {
    setShowModal(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#1B4965" barStyle="light-content" />
      <AlertPost />
      <AnnouncementModal
        visible={showModal}
        onClose={handleCloseAnnouncement}
        announcement={announcement || null}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
  },
});

export default Landing;
