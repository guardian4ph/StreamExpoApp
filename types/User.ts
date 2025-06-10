export interface ProfileInfo {
  bloodType?: string;
  emergencyContactPerson?: string;
  emergencyContactNumber?: string;
  emergencyContactRelationship?: string;
  skillsAndCertifications?: string;
  preferredRole?: string;
  affiliations?: string;
  validId?: string;
  isMedicalConditionsExists?: boolean;
  medicalConditions?: string;
  isAllergiesExists?: boolean;
  allergies?: string;
  isMedicationExists?: boolean;
  medications?: string;
  physicalLimitations?: string;
}

export interface Coordinates {
  lat: number | null;
  lon: number | null;
}

export interface Settings {
  isEnabled: boolean;
  isNotificationsEnabled: boolean;
  isAnnouncementEnabled: boolean;
  isLocationSharingEnabled: boolean;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  coordinates?: Coordinates;
  profileImage?: string;
  barangay?: string;
  city?: string;
  rating?: number;
  rank?: string;
  gender: "male" | "female";
  dateOfBirth: Date;
  followedLGUs: string[];
  profile: ProfileInfo;
  settings: Settings;
}
