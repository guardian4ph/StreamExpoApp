import * as SecureStore from "expo-secure-store";
import {createContext, useContext, useEffect, useState} from "react";

interface IncidentData {
  emergencyType: string;
  channelId: string;
  incidentId: string;
  timestamp: number;
}

interface IncidentContextProps {
  incidentState: IncidentData | null;
  setCurrentIncident: (data: IncidentData) => Promise<void>;
  clearIncident: () => Promise<void>;
}

const INCIDENT_KEY = "current-incident";
const IncidentContext = createContext<Partial<IncidentContextProps>>({});

// incident hook
export const useIncident = () => {
  return useContext(IncidentContext);
};

export const IncidentProvider = ({children}: any) => {
  const [incidentState, setIncidentState] = useState<IncidentData | null>(null);

  useEffect(() => {
    const loadIncident = async () => {
      const data = await SecureStore.getItemAsync(INCIDENT_KEY);
      if (data) {
        setIncidentState(JSON.parse(data));
      }
    };
    loadIncident();
  }, []);

  const setCurrentIncident = async (data: IncidentData) => {
    try {
      await SecureStore.setItemAsync(INCIDENT_KEY, JSON.stringify(data));
      setIncidentState(data);
    } catch (error) {
      console.error("Error saving incident:", error);
    }
  };

  const clearIncident = async () => {
    try {
      await SecureStore.deleteItemAsync(INCIDENT_KEY);
      setIncidentState(null);
    } catch (error) {
      console.error("Error clearing incident:", error);
    }
  };

  const value = {
    incidentState,
    setCurrentIncident,
    clearIncident,
  };

  return (
    <IncidentContext.Provider value={value}>
      {children}
    </IncidentContext.Provider>
  );
};
