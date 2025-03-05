import { Pressable, Text, StyleSheet } from "react-native";
import { useCall } from "@stream-io/video-react-native-sdk";

export const CustomRejectCallButton = () => {
  const call = useCall();

  const onCallRejectHandler = async () => {
    const reason = call.isCreatedByMe ? "cancel" : "decline";
    await call?.leave({ reject: true, reason });
  };

  return (
    <Pressable
      onPress={onCallRejectHandler}
      style={[styles.button, styles.rejectButton]}
    >
      <Text style={styles.buttonText}>Reject Call</Text>
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
  rejectButton: {
    backgroundColor: "#FF3742",
  },
});
