import React from "react";
import {Tabs} from "expo-router";
import {Image, TouchableOpacity, View, StyleSheet, Text} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {BottomTabBarProps} from "@react-navigation/bottom-tabs";

function CustomTabBar({state, descriptors, navigation}: BottomTabBarProps) {
  const currentRoute = state.routes[state.index];
  const nestedState = currentRoute.state as {
    index: number;
    routes: Array<{name: string}>;
  };
  if (
    currentRoute.name === "(room)" &&
    (nestedState?.routes?.[nestedState.index]?.name === "map-view" ||
      nestedState?.routes?.[nestedState.index]?.name === "loading-call")
  ) {
    return null;
  }

  return (
    <View style={styles.tabBarContainer}>
      {state.routes
        .filter(
          (route) =>
            route.name !== "profile" && route.name !== "change-password"
        )
        .map((route, index) => {
          const {options} = descriptors[route.key];
          const isFocused = state.index === index;

          let labelText: string;
          if (typeof options.tabBarLabel === "string") {
            labelText = options.tabBarLabel;
          } else if (typeof options.title === "string") {
            labelText = options.title;
          } else {
            labelText = route.name;
          }

          // for report button
          if (index === 2) {
            return (
              <TouchableOpacity
                key={route.key}
                style={styles.centerButton}
                onPress={() => {
                  navigation.navigate(route.name, {
                    screen: "index",
                  });
                }}>
                <Image
                  source={require("@/assets/images/Button.png")}
                  style={styles.centerButtonImage}
                />
              </TouchableOpacity>
            );
          }

          // other tab buttons
          return (
            <TouchableOpacity
              key={route.key}
              onPress={() => navigation.navigate(route.name)}
              style={styles.tabButton}>
              <View
                style={[
                  styles.tabButtonContent,
                  isFocused && styles.tabButtonFocused,
                ]}>
                {options.tabBarIcon &&
                  options.tabBarIcon({
                    color: "white",
                    size: 24,
                    focused: isFocused,
                  })}
                <Text style={styles.tabLabel}>{labelText}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
    </View>
  );
}

export default function MainLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Alerts",
          headerShown: true,
          headerStyle: {
            backgroundColor: "#1B4965",
          },
          headerTitle: "Emergency Alerts",
          headerTitleStyle: {
            color: "white",
            fontSize: 20,
            fontWeight: "bold",
            marginLeft: 10,
          },
          headerTitleAlign: "left",
          tabBarIcon: ({color}) => (
            <Ionicons name="alert-circle" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: "Messages",
          tabBarIcon: ({color}) => (
            <Ionicons name="mail" size={24} color={color} />
          ),
          headerShown: true,
          headerStyle: {
            backgroundColor: "#1B4965",
          },
          headerTitleStyle: {
            color: "white",
            fontSize: 20,
            fontWeight: "bold",
            marginLeft: 10,
          },
        }}
      />

      <Tabs.Screen name="(room)" options={{}} />
      <Tabs.Screen
        name="id"
        options={{
          title: "ID",
          tabBarIcon: ({color}) => (
            <Ionicons name="card" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          headerShown: true,
          headerStyle: {
            backgroundColor: "#1B4965",
          },
          headerTitle: "Settings",
          headerTitleStyle: {
            color: "white",
            fontSize: 20,
            fontWeight: "bold",
            marginLeft: 10,
          },
          tabBarIcon: ({color}) => (
            <Ionicons name="settings" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarButton: () => null,
          headerShown: true,
          headerStyle: {
            backgroundColor: "#1B4965",
          },
          headerTitle: "Profile",
          headerTitleStyle: {
            color: "white",
            fontSize: 20,
            fontWeight: "bold",
            marginLeft: 10,
          },
        }}
      />
      <Tabs.Screen
        name="change-password"
        options={{
          tabBarButton: () => null,
          headerShown: true,
          headerStyle: {
            backgroundColor: "#1B4965",
          },
          headerTitle: "Change Password",
          headerBackButtonDisplayMode: "generic",
          headerTitleStyle: {
            color: "white",
            fontSize: 20,
            fontWeight: "bold",
            marginLeft: 10,
          },
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: "row",
    height: 65,
    backgroundColor: "#1B4965",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 0,
  },
  tabButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    paddingVertical: 5,
  },
  tabButtonContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
    color: "white",
  },
  centerButton: {
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    width: 80,
    bottom: 10,
    position: "relative",
  },

  centerButtonImage: {
    width: 70,
    height: 70,
  },

  tabButtonFocused: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 6,
    borderRadius: 10,
  },
});
