import {useQuery} from "@tanstack/react-query";
import {Responder} from "@/types/Responder";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

/// get  respnder's profile info
async function getResponderInfo(responderId: string): Promise<Responder> {
  try {
    const response = await fetch(`${API_URL}/responders/${responderId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch responder info with id ${responderId}`);
    }
    return await response.json();
  } catch (error: any) {
    console.error("Error fetching respnder info:", error.message);
    throw new Error("Failed to fetch respnder info");
  }
}

export const useGetResponder = (responderId: string) => {
  return useQuery({
    queryKey: ["responder", responderId],
    queryFn: () => getResponderInfo(responderId),
    enabled: !!responderId,
    retry: false,
  });
};
