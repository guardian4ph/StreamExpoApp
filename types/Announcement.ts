export interface Announcement {
  title: string;
  message: string;
  image: string;
}

interface AnnouncementResponse {
  message: string;
  announcements: Announcement[];
}

export type {AnnouncementResponse};
