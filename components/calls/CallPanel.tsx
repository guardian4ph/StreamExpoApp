import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
} from "react-native";
import {
  CallingState,
  useCall,
  useCalls,
  useCallStateHooks,
  StreamCall,
  IncomingCall,
} from "@stream-io/video-react-native-sdk";
import {useRouter, useLocalSearchParams} from "expo-router";

const {width, height} = Dimensions.get("window");

export default function CallPanel() {
  const call = useCall();
  const isCallCreatedByMe = call?.isCreatedByMe;
  const {useCallCallingState} = useCallStateHooks();
  const router = useRouter();

  const handleAcceptCall = async () => {
    try {
      if (call) {
        await call.accept();
        router.push({
          pathname: "/landing/(room)/video-call",
          params: {id: "fad-call"},
        });
      }
    } catch (error) {
      console.error("Error accepting call:", error);
    }
  };

  const callingState = useCallCallingState();
  if (callingState === CallingState.RINGING && !isCallCreatedByMe) {
    return (
      <View style={[StyleSheet.absoluteFill, styles.fullScreenContainer]}>
        <IncomingCall onAcceptCallHandler={handleAcceptCall} />
      </View>
    );
  }
  return null;
}

const styles = StyleSheet.create({
  fullScreenContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: width,
    height: height,
    backgroundColor: "rgba(0,0,0,0.8)",
    zIndex: 9999,
    justifyContent: "center",
    alignItems: "center",
    margin: 0,
    padding: 0,
  },
});
