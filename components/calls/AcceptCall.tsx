import { Pressable, Text, StyleSheet } from "react-native";
import { useCall } from "@stream-io/video-react-native-sdk";

export const CustomAcceptCallButton = () => {
  const call = useCall();

  const onCallAcceptHandler = async () => {
    await call?.join();
  };

  return (
    <Pressable
      onPress={onCallAcceptHandler}
      style={[styles.button, styles.acceptButton]}
    >
      <Text style={styles.buttonText}>Accept Call</Text>
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
  acceptButton: {
    backgroundColor: "#20E070",
  },
});
