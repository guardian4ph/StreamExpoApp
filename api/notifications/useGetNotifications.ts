import {NotificationAlerts} from "@/types/Notifications";
import {useQuery} from "@tanstack/react-query";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

async function getNotificationsForUser(
  userId: string
): Promise<NotificationAlerts[]> {
  try {
    const response = await fetch(`${API_URL}/notifications/user/${userId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch notifications for this user");
    }
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Error fetching notifications:", error.message);
    throw new Error("Failed to fetch notifications");
  }
}

export const useGetNotifications = (userId: string) => {
  return useQuery({
    queryKey: ["notifications", userId],
    queryFn: () => getNotificationsForUser(userId),
    enabled: !!userId,
  });
};
