import "react-native-gesture-handler";
import {Slot, useSegments, useRouter} from "expo-router";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {useEffect, useState} from "react";
import {
  StreamVideoClient,
  StreamVideo,
  User,
} from "@stream-io/video-react-native-sdk";
import {OverlayProvider} from "stream-chat-expo";
import {IncidentProvider, useIncident} from "@/context/IncidentContext";
import {useAuthStore} from "@/context/useAuthStore";

const STREAM_KEY = process.env.EXPO_PUBLIC_STREAM_ACCESS_KEY;

const InitialLayout = () => {
  const {authenticated, token, user_id, initialized, initialize} =
    useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const {incidentState} = useIncident();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!initialized) return;
    const currentSegment = segments[0];
    if (authenticated && token) {
      if (currentSegment !== "landing") {
        console.log("Already authenticated. Routing to /landing");
        router.replace("/landing");
      }
    } else {
      if (currentSegment !== "(auth)") {
        console.log("Not authenticated. Going to /(auth)");
        if (client) {
          client.disconnectUser();
          setClient(null);
        }
        router.replace("/(auth)");
      }
    }
  }, [authenticated, token, initialized, segments, router, client]);

  useEffect(() => {
    if (authenticated && token && user_id) {
      console.log("Authenticated: Setting up Stream client");
      const user: User = {id: user_id};
      try {
        const streamClient = StreamVideoClient.getOrCreateInstance({
          apiKey: STREAM_KEY!,
          user,
          token: token,
        });
        setClient(streamClient);
      } catch (e) {
        console.log("Error creating Stream client: ", e);
      }
    } else if (!authenticated && client) {
      console.log("Not authenticated: Disconnecting Stream client");
      client.disconnectUser();
      setClient(null);
    }
  }, [authenticated, token, user_id]);

  useEffect(() => {
    if (incidentState) {
      router.replace({
        pathname: "/landing/(room)/room-verification",
        params: {
          emergencyType: incidentState.emergencyType,
          channelId: incidentState.channelId,
          incidentId: incidentState.incidentId,
        },
      });
    }
  }, [incidentState, router]);

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
    <IncidentProvider>
      <GestureHandlerRootView style={{flex: 1}}>
        <InitialLayout />
      </GestureHandlerRootView>
    </IncidentProvider>
  );
};

export default RootLayout;
