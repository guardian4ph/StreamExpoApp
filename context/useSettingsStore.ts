import {create} from "zustand";

interface SettingsState {
  enableAlerts: boolean;
  enableAnnouncements: boolean;
  notificationTone: boolean;
  doNotDisturb: boolean;
  criticalAlerts: boolean;
  shareLocation: boolean;
  autoUpdateLocation: boolean;
  notifications: {
    weather: boolean;
    earthquake: boolean;
    flood: boolean;
    fire: boolean;
    crime: boolean;
    traffic: boolean;
    government: boolean;
    utilities: boolean;
    overseasNews: boolean;
  };
  setEnableAlerts: (value: boolean) => void;
  setEnableAnnouncements: (value: boolean) => void;
  setNotificationTone: (value: boolean) => void;
  setDoNotDisturb: (value: boolean) => void;
  setCriticalAlerts: (value: boolean) => void;
  setShareLocation: (value: boolean) => void;
  setAutoUpdateLocation: (value: boolean) => void;
  setNotification: (type: string, value: boolean) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  enableAlerts: true,
  enableAnnouncements: true,
  notificationTone: true,
  doNotDisturb: true,
  criticalAlerts: true,
  shareLocation: true,
  autoUpdateLocation: true,
  notifications: {
    weather: true,
    earthquake: true,
    flood: true,
    fire: true,
    crime: true,
    traffic: true,
    government: true,
    utilities: true,
    overseasNews: true,
  },
  setEnableAlerts: (value) => set({enableAlerts: value}),
  setEnableAnnouncements: (value) => set({enableAnnouncements: value}),
  setNotificationTone: (value) => set({notificationTone: value}),
  setDoNotDisturb: (value) => set({doNotDisturb: value}),
  setCriticalAlerts: (value) => set({criticalAlerts: value}),
  setShareLocation: (value) => set({shareLocation: value}),
  setAutoUpdateLocation: (value) => set({autoUpdateLocation: value}),
  setNotification: (type, value) =>
    set((state) => ({
      notifications: {
        ...state.notifications,
        [type]: value,
      },
    })),
}));
