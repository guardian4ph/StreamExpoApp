import {Incident} from "@/types/incidents";
import {useQuery} from "@tanstack/react-query";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// GET SPECIFIC INCIENDT
async function getIncidentById(incidentId: string): Promise<Incident> {
  try {
    const response = await fetch(`${API_URL}/incidents/${incidentId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch incident with ID ${incidentId}`);
    }
    return await response.json();
  } catch (error: any) {
    console.error("Error fetching incident:", error.message);
    throw new Error("Failed to fetch incident");
  }
}

export const useFetchIncident = (incidentId: string) => {
  return useQuery({
    queryKey: ["incident", incidentId],
    queryFn: () => getIncidentById(incidentId),
    refetchInterval: 3000,
    enabled: !!incidentId,
    refetchOnWindowFocus: false,
    staleTime: 2000,
  });
};
