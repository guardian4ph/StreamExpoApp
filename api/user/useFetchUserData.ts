import {useAuthStore} from "@/context/useAuthStore";
import {User} from "@/types/User";
import {useQuery} from "@tanstack/react-query";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

/// get volunteer user's profile info
async function getUserInfo(userId: string): Promise<User> {
  try {
    const response = await fetch(`${API_URL}/volunteers/${userId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch volunteer info with id ${userId}`);
    }
    return await response.json();
  } catch (error: any) {
    console.error("Error fetching user info:", error.message);
    throw new Error("Failed to fetch user info");
  }
}

export const useFetchUserData = (userId: string) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserInfo(userId),
    enabled: !!userId,
  });
};
