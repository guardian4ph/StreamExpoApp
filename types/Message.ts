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
  scheduleDate?: Date;
};

export type Message = {
  _id: string;
  title: string;
  message: string;
  type: string;
  image: string;
  demographics: Demographics;
  schedule: Schedule;
  createdAt: string;
  updatedAt: string;
};
