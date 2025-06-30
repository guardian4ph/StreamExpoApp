import {useQuery} from "@tanstack/react-query";
import {Responder} from "@/types/Responder";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

/// get  respnder's profile info
async function getResponderInfo(responderId: string): Promise<Responder> {
  try {
    const response = await fetch(`${API_URL}/responders/${responderId}`);

    if (!response.ok) {
      let errorMessage = `Failed to fetch responder info with id ${responderId}`;
      try {
        const errorData = await response.text();
        if (errorData) {
          errorMessage = errorData;
        }
      } catch (readError) {
        console.warn("Could not read error response body:", readError);
      }

      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error fetching responder info:", error.message);
    throw new Error("Failed to fetch responder info");
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
