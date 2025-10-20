import { Message } from "@/types/Message";
import { useQuery } from "@tanstack/react-query";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

async function getMessagesForUser(userId: string): Promise<Message[]> {
  try {
    const response = await fetch(`${API_URL}/messages/user/${userId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch messages for this user");
    }
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Error fetching messages:", error.message);
    throw new Error("Failed to fetch messages");
  }
}

async function getDirectMessagesForUser(userId: string): Promise<Message[]> {
  try {
    const response = await fetch(`${API_URL}/messages/direct/${userId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch direct messages for this user");
    }
    const data = await response.json();
    return data.data || data; // Handle both response formats
  } catch (error: any) {
    console.error("Error fetching direct messages:", error.message);
    throw new Error("Failed to fetch direct messages");
  }
}

export const useGetMessages = (userId: string) => {
  return useQuery({
    queryKey: ["messages", userId],
    queryFn: () => getMessagesForUser(userId),
    enabled: !!userId,
  });
};

export const useGetDirectMessages = (userId: string) => {
  return useQuery({
    queryKey: ["direct-messages", userId],
    queryFn: () => getDirectMessagesForUser(userId),
    enabled: !!userId,
  });
};
