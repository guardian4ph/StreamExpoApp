import "react-native-gesture-handler";
import {Slot, Stack, useSegments} from "expo-router";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {AuthProvider, useAuth} from "@/context/AuthContext";
import {useEffect, useState} from "react";
import {useRouter} from "expo-router";
import {
  StreamVideoClient,
  StreamVideo,
  User,
} from "@stream-io/video-react-native-sdk";
import {OverlayProvider} from "stream-chat-expo";

const STREAM_KEY = process.env.EXPO_PUBLIC_STREAM_ACCESS_KEY;

const InitialLayout = () => {
  const {authState, initialized} = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [client, setClient] = useState<StreamVideoClient | null>(null);

  useEffect(() => {
    if (!initialized) return;
    const inAuthGroup = segments[0] === "landing";
    if (authState?.authenticated && !inAuthGroup) {
      console.log("Authenticated and in Authgroup");
      router.replace("/landing");
    } else if (!authState?.authenticated) {
      console.log("NOT Authenticated ");
      client?.disconnectUser();
      router.replace("/(auth)");
    }
  }, [authState, initialized]);

  useEffect(() => {
    if (authState?.authenticated && authState.token) {
      console.log("Creating a client");
      const user: User = {id: authState.user_id!};
      try {
        const client = new StreamVideoClient({
          apiKey: STREAM_KEY!,
          user,
          token: authState.token,
        });
        setClient(client);
      } catch (e) {
        console.log("Error creating client: ", e);
      }
    }
  }, [authState]);

  return (
    <>
      {!client && <Slot />}
      {client && (
        <StreamVideo client={client}>
          <OverlayProvider>
            <Slot />
          </OverlayProvider>
        </StreamVideo>
      )}
    </>
  );
};

const RootLayout = () => {
  return (
    <AuthProvider>
      <GestureHandlerRootView style={{flex: 1}}>
        <InitialLayout />
      </GestureHandlerRootView>
    </AuthProvider>
  );
};

export default RootLayout;
