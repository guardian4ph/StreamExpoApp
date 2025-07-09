import {Announcement, AnnouncementResponse} from "@/types/Announcement";
import {useQuery} from "@tanstack/react-query";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

async function getAnnouncement(userId: string): Promise<Announcement> {
  try {
    const response = await fetch(`${API_URL}/announcements/user/${userId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch announcement for this user");
    }
    const data: AnnouncementResponse = await response.json();
    return data.announcements[0] || null;
  } catch (error: any) {
    console.error("Error fetching announcement:", error.message);
    throw new Error("Failed to fetch announcement");
  }
}

export const useGetAnnouncement = (userId: string) => {
  return useQuery({
    queryKey: ["announcement", userId],
    queryFn: () => getAnnouncement(userId),
    enabled: !!userId,
    // will use socket io for this later on to signal the refetch..
    // refetchInterval: 30000,
    // refetchIntervalInBackground: true,
  });
};
