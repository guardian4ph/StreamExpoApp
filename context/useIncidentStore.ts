import * as SecureStore from "expo-secure-store";
import {create} from "zustand";
import {useAuthStore} from "@/context/useAuthStore";

const INCIDENT_KEY = "incidents";

interface IncidentData {
  incidentType: string;
  channelId: string;
  incidentId: string;
  userId: string;
  isAccepted?: boolean;
  isFinished?: boolean;
  dispatcher?: string;
  timestamp?: number;
  responderStatus?: "enroute" | "onscene" | "medicalFacility" | "rtb" | "close";
  location?: {
    lat?: number;
    lon?: number;
    address?: string;
  };
  responderCoordinates?: {
    lat?: number;
    lon?: number;
  };
}

interface IncidentStore {
  incidentState: IncidentData | null;
  setCurrentIncident: (data: IncidentData) => Promise<void>;
  updateIncidentLocation: (locationData: {
    latitude: number;
    longitude: number;
    address: string;
  }) => Promise<void>;
  clearActiveIncident: () => Promise<void>;
  loadUserIncident: () => Promise<void>;
}

export const useIncidentStore = create<IncidentStore>((set, get) => ({
  incidentState: null,

  setCurrentIncident: async (data: IncidentData) => {
    try {
      const {user_id} = useAuthStore.getState();
      if (!user_id) {
        throw new Error("No user ID found, cannot set current incident.");
      }

      const incidentWithUser = {
        ...data,
        userId: user_id,
      };

      const existingIncidentsStr = await SecureStore.getItemAsync(INCIDENT_KEY);
      const existingIncidents = existingIncidentsStr
        ? JSON.parse(existingIncidentsStr)
        : {};

      const updatedIncidents = {
        ...existingIncidents,
        [user_id]: incidentWithUser,
      };

      await SecureStore.setItemAsync(
        INCIDENT_KEY,
        JSON.stringify(updatedIncidents)
      );
      set({incidentState: incidentWithUser});
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
      if (!currentIncident || currentIncident.userId !== user_id) {
        console.warn(
          "Mismatch between current incident user and authenticated user, or no current incident. Aborting update."
        );
        return;
      }

      const existingIncidentsStr = await SecureStore.getItemAsync(INCIDENT_KEY);
      if (!existingIncidentsStr) return;

      const existingIncidents = JSON.parse(existingIncidentsStr);
      const userIncident = existingIncidents[user_id];

      if (!userIncident) return;

      const updatedIncident = {
        ...userIncident,
        location: {
          lat: locationData.latitude,
          lon: locationData.longitude,
          address: locationData.address,
        },
      };

      const updatedIncidents = {
        ...existingIncidents,
        [user_id]: updatedIncident,
      };

      await SecureStore.setItemAsync(
        INCIDENT_KEY,
        JSON.stringify(updatedIncidents)
      );
      set({incidentState: updatedIncident});
    } catch (error) {
      console.error("Error updating incident location:", error);
    }
  },

  clearActiveIncident: async () => {
    const incidentInMemory = get().incidentState;
    const userIdFromMemory = incidentInMemory?.userId;

    set({incidentState: null});

    if (userIdFromMemory) {
      try {
        const existingIncidentsStr = await SecureStore.getItemAsync(
          INCIDENT_KEY
        );
        if (existingIncidentsStr) {
          const existingIncidents = JSON.parse(existingIncidentsStr);
          if (existingIncidents.hasOwnProperty(userIdFromMemory)) {
            const {[userIdFromMemory]: _removed, ...remainingIncidents} =
              existingIncidents;
            await SecureStore.setItemAsync(
              INCIDENT_KEY,
              JSON.stringify(remainingIncidents)
            );
          }
        }
      } catch (error) {
        console.error(
          `Error clearing incident from SecureStore for user ${userIdFromMemory}:`,
          error
        );
      }
    }
  },

  loadUserIncident: async () => {
    try {
      const {user_id} = useAuthStore.getState();
      if (!user_id) {
        set({incidentState: null});
        return;
      }

      const incidentsStr = await SecureStore.getItemAsync(INCIDENT_KEY);
      if (incidentsStr) {
        const incidents = JSON.parse(incidentsStr);
        const userIncident = incidents[user_id];

        if (userIncident) {
          set({incidentState: userIncident});
        } else {
          set({incidentState: null});
        }
      } else {
        set({incidentState: null});
      }
    } catch (error: any) {
      console.error("Error loading user incident from SecureStore:", error);
      set({incidentState: null});
    }
  },
}));
