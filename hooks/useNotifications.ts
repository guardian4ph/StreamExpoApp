import * as Notifications from "expo-notifications";
import messaging, {
  FirebaseMessagingTypes,
} from "@react-native-firebase/messaging";
import {getApp} from "@react-native-firebase/app";
import {useEffect} from "react";
import {useAuthStore} from "@/context/useAuthStore";
import {Platform} from "react-native";
import {useQueryClient} from "@tanstack/react-query";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const useNotifications = () => {
  const {user_id, authenticated} = useAuthStore();
  const queryClient = useQueryClient();

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log("Auth status: ", authStatus);
      await subscribeToTopic();
      getFcmToken();
    }
  };

  const subscribeToTopic = async () => {
    try {
      await messaging().subscribeToTopic("all_users");
      console.log("Subscribed to all_users topic");
    } catch (error) {
      console.error("Error subscribing to topic:", error);
    }
  };

  const saveTokenToBackend = async (token: string) => {
    if (!authenticated || !user_id) {
      console.log("User not authenticated, skipping token save");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/tokens/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user_id,
            token,
            platform: Platform.OS,
          }),
        }
      );

      const data = await response.json();
      console.log("Token saved to backend:", data);
    } catch (error) {
      console.error("Error saving token to backend:", error);
    }
  };

  const getFcmToken = async () => {
    try {
      const token = await messaging().getToken();
      console.log("FCM token: ", token);

      if (authenticated && user_id) {
        await saveTokenToBackend(token);
      }

      return token;
    } catch (error) {
      console.error("Error getting FCM token:", error);
    }
  };

  const showNotification = async (title: string, body: string) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
        vibrate: [0, 250, 250, 250],
      },
      trigger: null,
    });
    if (user_id) {
      queryClient.invalidateQueries({queryKey: ["notifications", user_id]});
    }
  };

  useEffect(() => {
    requestUserPermission();

    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log("Notification received in foreground", remoteMessage);
      await showNotification(
        remoteMessage.notification?.title || "",
        remoteMessage.notification?.body || ""
      );
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log("Notification received in background", remoteMessage);
      await showNotification(
        remoteMessage.notification?.title || "",
        remoteMessage.notification?.body || ""
      );
    });
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log(
        "Notification opened app from background state:",
        remoteMessage
      );
    });

    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log("App opened from quit state:", remoteMessage);
        }
      });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (authenticated && user_id) {
      getFcmToken();
    }
  }, [authenticated, user_id]);

  return {
    getFcmToken,
    requestUserPermission,
  };
};
