import {SafeAreaView, StyleSheet, Text, View, Image} from "react-native";
import {
  CallingState,
  useCall,
  useCalls,
  useCallStateHooks,
  StreamCall,
  IncomingCall,
} from "@stream-io/video-react-native-sdk";
import {useRouter, useLocalSearchParams} from "expo-router";

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
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.8)",
          zIndex: 9999,
          flex: 1,
          justifyContent: "center",
          width: "100%",
          alignItems: "center",
        }}>
        <IncomingCall onAcceptCallHandler={handleAcceptCall} />
      </View>
    );
  }
  return null;
}
