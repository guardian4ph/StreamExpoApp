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
import {useAuthStore} from "@/context/useAuthStore";
import {useIncidentStore} from "@/context/useIncidentStore";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const STREAM_KEY = process.env.EXPO_PUBLIC_STREAM_ACCESS_KEY;
const queryClient = new QueryClient();

const InitialLayout = () => {
  const {authenticated, token, user_id, initialized, initialize} =
    useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const {incidentState, loadUserIncident, clearActiveIncident} =
    useIncidentStore();

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
    if (authenticated && token && user_id && STREAM_KEY) {
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
      client
        .disconnectUser()
        .catch((e) => console.error("Error disconnecting stream user", e));
      setClient(null);
    }
  }, [authenticated, token, user_id, client]);

  // useEffect(() => {
  //   if (incidentState && incidentState.userId == user_id) {
  //     router.replace({
  //       pathname: "/landing/(room)/room-verification",
  //       params: {
  //         emergencyType: incidentState.incidentType,
  //         channelId: incidentState.channelId,
  //         incidentId: incidentState.incidentId,
  //       },
  //     });
  //   }
  // }, [incidentState, router, user_id]);

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
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{flex: 1}}>
        <InitialLayout />
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
};

export default RootLayout;
