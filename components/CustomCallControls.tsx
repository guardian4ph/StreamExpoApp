import {
  CallControlProps,
  useCall,
  HangUpCallButton,
  ToggleAudioPublishingButton,
  ToggleVideoPublishingButton,
  ToggleCameraFaceButton,
  ReactionsButton,
  StreamReactionType,
} from "@stream-io/video-react-native-sdk";
import React from "react";
import {View, StyleSheet, Button} from "react-native";
import Colors from "../constants/Colors";

export const reactions: StreamReactionType[] = [
  {
    type: "reaction",
    emoji_code: ":smile:",
    custom: {},
    icon: "😊",
  },
  {
    type: "raised-hand",
    emoji_code: ":raise-hand:",
    custom: {},
    icon: "✋",
  },
  {
    type: "reaction",
    emoji_code: ":fireworks:",
    custom: {},
    icon: "🎉",
  },
  {
    type: "reaction",
    emoji_code: ":like:",
    custom: {},
    icon: "😍",
  },
];

// Custom View for the call controls and reactions
const CustomCallControls = (props: CallControlProps) => {
  const call = useCall();

  const onLike = () => {
    const reaction = {
      type: "reaction",
      emoji_code: ":like:",
      custom: {},
      icon: "😍",
    };
    call?.sendReaction(reaction);
  };

  const handleHangup = async () => {
    try {
      await call?.leave();
      if (props.onHangupCallHandler) {
        props.onHangupCallHandler();
      }
    } catch (error) {
      console.error("Error hanging up:", error);
      if (props.onHangupCallHandler) {
        props.onHangupCallHandler();
      }
    }
  };
  return (
    <View style={styles.customCallControlsContainer}>
      <ToggleAudioPublishingButton
        onPressHandler={() => call?.microphone.toggle()}
      />
      <ToggleVideoPublishingButton
        onPressHandler={() => call?.camera.toggle()}
      />
      <ToggleCameraFaceButton onPressHandler={() => call?.camera.flip()} />
      <HangUpCallButton onHangupCallHandler={handleHangup} />
      <ReactionsButton supportedReactions={reactions} />
      {/* <Button onPress={onLike} title="Like!" color={Colors.secondary} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  customCallControlsContainer: {
    position: "absolute",
    right: 0,
    top: 120,
    gap: 10,
    marginHorizontal: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#0333c17c",
    borderRadius: 6,
    borderColor: "#fff",
    borderWidth: 2,
    zIndex: 5,
  },
});

export default CustomCallControls;
