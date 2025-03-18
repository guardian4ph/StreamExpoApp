import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import React from "react";
import {rooms} from "@/assets/data/rooms";
import {Link, useRouter} from "expo-router";
import {Ionicons} from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import AlertPost from "@/components/landingComponents/AlertPost";

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

const Landing = () => {
  const router = useRouter();
  const onStartMeeting = async () => {
    const randomId = Math.floor(Math.random() * 1000).toString();
    router.push(`/landing/(room)/${randomId}`);
  };

  const onJoinMeeting = async () => {
    Alert.prompt(
      "Join Meeting",
      "Please enter your Call",
      (id) => {
        console.log("🚀 ~ onJoinMeeting ~ id:", id);
        router.push(`/landing/(room)/${id}`);
      },
      "plain-text"
    );
  };

  return (
    <ScrollView style={styles.container}>
      <AlertPost />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 20,
  },
});

export default Landing;
