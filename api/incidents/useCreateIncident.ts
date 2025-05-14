import {useMutation} from "@tanstack/react-query";
import {CreateIncidentProps} from "@/types/incidents";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const createIncident = async (incident: CreateIncidentProps) => {
  const response = await fetch(`${API_URL}/incidents/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(incident),
  });

  if (!response.ok) {
    throw new Error("Failed to create incident");
  }

  return response.json();
};

export const useCreateIncident = () => {
  return useMutation({
    mutationFn: createIncident,
    onError: (error: any) => {
      console.error("Error creating incident: ", error);
    },
  });
};
