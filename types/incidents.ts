import {Dispatcher} from "@/types/Dispatcher";
import {Responder} from "@/types/Responder";
import {User} from "@/types/User";
import {OpCen} from "@/types/opCen";

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
  dispatcher?: Dispatcher;
  opCen?: OpCen;
  opCenStatus: "idle" | "connecting" | "connected";
  responder?: Responder;
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
