import { Stack } from "expo-router";
import React from "react";

export default function RoomLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerBackVisible: false,
          headerTitle: "Select Emergency",
          headerTitleStyle: {
            color: "white",
            fontSize: 16,
            fontWeight: "100",
          },
          headerStyle: {
            backgroundColor: "#215a75",
          },
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          headerTitle: "Message Dispatch Operator",
        }}
      />
      <Stack.Screen name="video-call" options={{ headerShown: false }} />
      <Stack.Screen
        name="loading-call"
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="room-verification"
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen name="map-view" options={{ headerShown: false }} />
    </Stack>
  );
}
