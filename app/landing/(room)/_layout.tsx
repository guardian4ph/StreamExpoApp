import {Stack} from "expo-router";
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
          },
          headerStyle: {
            backgroundColor: "#1B4965",
          },
          gestureEnabled: false,
        }}
      />
      <Stack.Screen name="[id]" />
      <Stack.Screen name="video-call" options={{headerShown: false}} />
      <Stack.Screen
        name="loading-call"
        options={{headerShown: false, gestureEnabled: false}}
      />
      <Stack.Screen
        name="room-verification"
        options={{headerShown: false, gestureEnabled: false}}
      />
    </Stack>
  );
}
