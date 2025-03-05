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
import { rooms } from "@/assets/data/rooms";
import { Link, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";

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
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity style={styles.button} onPress={onStartMeeting}>
          <Ionicons name="videocam-outline" size={24} color={"#fff"} />
          <Text style={{ color: "#fff" }}>Start Meeting</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={onJoinMeeting}>
          <Ionicons name="business-outline" size={24} color={"#fff"} />
          <Text style={{ color: "#fff" }}>Join Meeting</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.wrapper}>
        {rooms.map((room) => (
          <Link key={room.id} href={`/landing/(room)/${room.id}`} asChild>
            {/* <Text> {room.img}</Text> */}
            <TouchableOpacity>
              <ImageBackground
                imageStyle={{ borderRadius: 10 }}
                source={room.img}
                style={styles.image}
              >
                <View style={styles.overlay}>
                  <Text style={styles.text}> {room.name}</Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          </Link>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  wrapper: {
    alignItems: "center",
    display: "flex",
    flexDirection: WIDTH > HEIGHT ? "row" : "column",
    // flexDirection: "row",
    justifyContent: "center",
  },
  image: {
    width: WIDTH > HEIGHT ? WIDTH / 4 - 25 : WIDTH - 40,
    height: 200,

    margin: 5,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 10,
  },
  text: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "700",
    textAlign: "center",
  },
  button: {
    flex: 1,
    gap: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.secondary,
    margin: 20,
    padding: 25,
    borderRadius: 10,
  },
});

export default Landing;
