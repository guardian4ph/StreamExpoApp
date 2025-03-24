import {Stack} from "expo-router";
import React from "react";

export default function RoomLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Select Emergency",
          headerTitleStyle: {
            color: "white",
          },
          headerStyle: {
            backgroundColor: "#1B4965",
          },
        }}
      />
      <Stack.Screen name="[id]" />
      <Stack.Screen name="VideoCall" options={{headerShown: false}} />
      <Stack.Screen name="loadingCall" options={{headerShown: false}} />
      <Stack.Screen name="RoomVerification" options={{headerShown: false}} />
    </Stack>
  );
}
