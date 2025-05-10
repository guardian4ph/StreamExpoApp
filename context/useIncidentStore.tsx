import * as SecureStore from "expo-secure-store";
import {create} from "zustand";

const INCIDENT_KEY = "current-incident";

interface IncidentData {
  emergencyType: string;
  channelId: string;
  incidentId: string;
  isAccepted: boolean;
  isFinished: boolean;
  dispatcher?: string;
  timestamp: number;
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
  clearIncident: () => Promise<void>;
}

export const useIncidentStore = create<IncidentStore>((set) => ({
  incidentState: null,

  setCurrentIncident: async (data: IncidentData) => {
    try {
      await SecureStore.setItemAsync(INCIDENT_KEY, JSON.stringify(data));
      set({incidentState: data});
    } catch (error) {
      console.error("Error saving incident:", error);
    }
  },

  updateIncidentLocation: async (locationData: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    try {
      const currentState = await SecureStore.getItemAsync(INCIDENT_KEY);
      if (!currentState) return;

      const updatedIncident = {
        ...JSON.parse(currentState),
        location: locationData,
      };

      await SecureStore.setItemAsync(
        INCIDENT_KEY,
        JSON.stringify(updatedIncident)
      );
      set({incidentState: updatedIncident});
    } catch (error) {
      console.error("Error updating incident location:", error);
    }
  },

  clearIncident: async () => {
    try {
      await SecureStore.deleteItemAsync(INCIDENT_KEY);
      set({incidentState: null});
    } catch (error) {
      console.error("Error clearing incident:", error);
    }
  },
}));

const initializeStore = async () => {
  try {
    const data = await SecureStore.getItemAsync(INCIDENT_KEY);
    if (data) {
      useIncidentStore.setState({incidentState: JSON.parse(data)});
    }
  } catch (error: any) {
    console.error("Error intiazlizing incident state/store", error);
  }
};

initializeStore();
