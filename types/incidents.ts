import {User} from "@/types/User";

export interface Coordinates {
  lat: number | null;
  lon: number | null;
}

export interface IncidentDetails {
  incident?: string;
  incidentDescription?: string;
  coordinates?: Coordinates;
  location?: string;
}

export interface Incident {
  _id: string;
  incidentType: string;
  channelId: string;
  isVerified: boolean;
  isResolved: boolean;
  isAccepted: boolean;
  isFinished: boolean;
  acceptedAt: Date;
  user: User;
  dispatcher?: string;
  opCen?: string;
  opCenStatus: "idle" | "connecting" | "connected";
  responder?: string;
  isAcceptedResponder: boolean;
  responderStatus?: "enroute" | "onscene" | "facility" | "rtb";
  responderCoordinates?: Coordinates;
  incidentDetails?: IncidentDetails;
  selectedFacility?: string;
  [key: string]: any;
}

export interface CreateIncidentProps {
  incidentType: string;
  userId: string;
  incidentDetails: {
    coordinates: Coordinates;
  };
}
