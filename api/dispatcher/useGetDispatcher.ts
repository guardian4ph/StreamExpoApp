import {useQuery} from "@tanstack/react-query";
import {Dispatcher} from "@/types/Dispatcher";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

/// get dispatcher user's profile info
async function getDispatcherInfo(dispatcherId: string): Promise<Dispatcher> {
  try {
    const response = await fetch(`${API_URL}/dispatchers/${dispatcherId}`);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch dispatcher info with id ${dispatcherId}`
      );
    }
    return await response.json();
  } catch (error: any) {
    console.error("Error fetching dispatcher info:", error.message);
    throw new Error("Failed to fetch dispatcher info");
  }
}

export const useGetDispatcher = (dispatcherId: string) => {
  return useQuery({
    queryKey: ["dispatcher", dispatcherId],
    queryFn: () => getDispatcherInfo(dispatcherId),
    enabled: !!dispatcherId,
  });
};
