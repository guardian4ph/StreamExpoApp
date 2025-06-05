export type Demographics = {
  gender?: string;
  workStatus?: string;
  civilStatus?: string;
  barangay?: string;
  fromAge?: number;
  toAge?: number;
};

export type Schedule = {
  sendNow: boolean;
  scheduleData?: string;
};

export type NotificationAlerts = {
  _id: string;
  title: string;
  message: string;
  type: string;
  images: string[];
  demographics: Demographics;
  schedule: Schedule;
  createdAt: string;
  updatedAt: string;
};
