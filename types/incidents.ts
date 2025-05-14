export interface Coordinates {
  lat: number | null;
  lon: number | null;
}
export interface IncidentLocation {
  address?: string;
  coordinates?: Coordinates;
}

export interface Incident {
  incidentId: string;
  incidentType: string;
  location: Location;
  channelId: string;
  dispatcher?: string;
  isVerified: boolean;
  responder: string;
  isAcceptedResponder: boolean;
  responderStatus?: string;
  isResolved: boolean;
  isAccepted: boolean;
  isFinished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateIncidentProps {
  incidentType: string;
  userId: string;
  incidentDetails: {
    coordinates: Coordinates;
  };
}
