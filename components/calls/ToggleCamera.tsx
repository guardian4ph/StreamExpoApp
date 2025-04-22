import { useCall, useCallStateHooks } from "@stream-io/video-react-native-sdk";
import { Pressable, Text, StyleSheet } from "react-native";

export const ToggleCameraFaceButton = () => {
  const call = useCall();
  const { useCameraState } = useCallStateHooks();
  const { direction } = useCameraState();

  const toggleCameraFacingMode = async () => {
    onPressHandler?.();
    await call?.camera.flip();
  };

  const videoFaceButtonStyles = [
    styles.button,
    {
      backgroundColor: direction === "back" ? "#080707dd" : "white",
    },
  ];

  const videoFaceButtonTextStyles = [
    styles.mediaButtonText,
    {
      color: direction === "back" ? "white" : "#080707dd",
    },
  ];

  return (
    <Pressable onPress={toggleCameraFacingMode} style={videoFaceButtonStyles}>
      {direction === "front" ? (
        <Text style={videoFaceButtonTextStyles}>Back</Text>
      ) : (
        <Text style={videoFaceButtonTextStyles}>Front</Text>
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
