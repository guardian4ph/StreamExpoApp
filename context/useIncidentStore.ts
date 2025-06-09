import * as SecureStore from "expo-secure-store";
import {create} from "zustand";
import {useAuthStore} from "@/context/useAuthStore";
import {Incident} from "@/types/incidents";

const INCIDENT_KEY = "current-incident";

interface IncidentStore {
  incidentState: Incident | null;
  setCurrentIncident: (data: Incident) => Promise<void>;
  updateIncidentLocation: (locationData: {
    latitude: number;
    longitude: number;
    address: string;
  }) => Promise<void>;
  clearActiveIncident: () => Promise<void>;
  loadIncident: () => Promise<void>;
}

export const useIncidentStore = create<IncidentStore>((set, get) => ({
  incidentState: null,

  loadIncident: async () => {
    try {
      const {user_id} = useAuthStore.getState();
      if (!user_id) {
        set({incidentState: null});
        return;
      }

      const data = await SecureStore.getItemAsync(`${INCIDENT_KEY}-${user_id}`);
      if (data) {
        const parsedData = JSON.parse(data);
        set({incidentState: parsedData});
      }
    } catch (error) {
      console.error("Error loading incident:", error);
    }
  },

  setCurrentIncident: async (data: Incident) => {
    try {
      const {user_id} = useAuthStore.getState();
      if (!user_id) {
        throw new Error("No user ID found, cannot set current incident.");
      }

      await SecureStore.setItemAsync(
        `${INCIDENT_KEY}-${user_id}`,
        JSON.stringify(data)
      );
      set({incidentState: data});
    } catch (error) {
      console.error("Error setting current incident:", error);
    }
  },

  updateIncidentLocation: async (locationData: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    try {
      const {user_id} = useAuthStore.getState();
      if (!user_id) {
        console.warn("Cannot update incident location: No user ID found.");
        return;
      }

      const currentIncident = get().incidentState;
      if (!currentIncident) {
        console.warn("No current incident to update.");
        return;
      }

      const updatedIncident = {
        ...currentIncident,
        incidentDetails: {
          ...currentIncident.incidentDetails,
          coordinates: {
            lat: locationData.latitude,
            lon: locationData.longitude,
          },
          location: locationData.address,
        },
      };

      await SecureStore.setItemAsync(
        `${INCIDENT_KEY}-${user_id}`,
        JSON.stringify(updatedIncident)
      );
      set({incidentState: updatedIncident});
    } catch (error) {
      console.error("Error updating incident location:", error);
    }
  },

  clearActiveIncident: async () => {
    try {
      const {user_id} = useAuthStore.getState();
      if (user_id) {
        await SecureStore.deleteItemAsync(`${INCIDENT_KEY}-${user_id}`);
      }
      set({incidentState: null});
    } catch (error) {
      console.error("Error clearing incident:", error);
    }
  },
}));
