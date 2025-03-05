import { Pressable, Text, StyleSheet } from "react-native";
import { useCall, useCallStateHooks } from "@stream-io/video-react-native-sdk";

export const ToggleAudioButton = () => {
  const call = useCall();
  const { useMicrophoneState } = useCallStateHooks();
  const { status } = useMicrophoneState();

  const toggleAudioMuted = async () => {
    await call?.microphone.toggle();
  };

  const audioButtonStyles = [
    styles.button,
    {
      backgroundColor: status === "disabled" ? "#080707dd" : "white",
    },
  ];

  const audioButtonTextStyles = [
    styles.mediaButtonText,
    {
      color: status === "disabled" ? "white" : "#080707dd",
    },
  ];

  return (
    <Pressable onPress={toggleAudioMuted} style={audioButtonStyles}>
      {status === "disabled" ? (
        <Text style={audioButtonTextStyles}>Audio On</Text>
      ) : (
        <Text style={audioButtonTextStyles}>Audio Off</Text>
      )}
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
  mediaButtonText: {
    textAlign: "center",
  },
});
