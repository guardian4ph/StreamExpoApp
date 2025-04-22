import { Pressable, Text, StyleSheet } from "react-native";
import { useCall } from "@stream-io/video-react-native-sdk";

export const CustomHangupCallButton = () => {
  const call = useCall();

  const onCallHangupHandler = async () => {
    await call?.leave();
  };

  return (
    <Pressable
      onPress={onCallHangupHandler}
      style={[styles.button, styles.hangupButton]}
    >
      <Text style={styles.buttonText}>Hangup Call</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 80,
    width: 80,
    borderRadius: 40,
    justifyContent: "center",
  },
  buttonText: {
    textAlign: "center",
  },
  hangupButton: {
    backgroundColor: "#FF3742",
  },
});
