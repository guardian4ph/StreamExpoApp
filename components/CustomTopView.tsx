import {useCallStateHooks} from "@stream-io/video-react-native-sdk";
import {View, StyleSheet, Text} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import Colors from "@/constants/Colors";

// Custom View to display the number of participants in the call
const CustomTopView = () => {
  const {useParticipants} = useCallStateHooks();
  const participants = useParticipants();

  return (
    <View style={styles.topContainer}>
      <Text ellipsizeMode="tail" numberOfLines={1} style={styles.topText}>
        {participants.length} {participants.length > 1 ? "s" : ""}
      </Text>
      <Ionicons name="people-circle-outline" size={24} color="white" />
    </View>
  );
};

const styles = StyleSheet.create({
  topContainer: {
    // width: "30%",
    position: "absolute",
    top: "2%",
    left: "2%",
    height: 50,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    padding: 9,
    borderRadius: "100%",
  },
  topText: {
    color: "white",
    fontSize: 10,
  },
});

export default CustomTopView;
