import {Incident} from "@/types/incidents";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// GET SPECIFIC INCIENDT
export async function getIncidentById(incidentId: string): Promise<Incident> {
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
