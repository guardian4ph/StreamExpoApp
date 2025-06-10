import * as SecureStore from "expo-secure-store";
import {create} from "zustand";

const TOKEN_KEY = "auth-token";
const API_URL = process.env.EXPO_PUBLIC_API_URL;

interface AuthState {
  token: string | null;
  authenticated: boolean | null;
  user_id: string | null;
  initialized: boolean;
}

interface AuthStore extends AuthState {
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  register: (
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    password: string,
    address: string,
    barangay: string,
    city: string,
    gender: string,
    dateOfBirth: string
  ) => Promise<any>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  token: null,
  authenticated: null,
  user_id: null,
  initialized: false,

  // initialize store
  initialize: async () => {
    const data = await SecureStore.getItemAsync(TOKEN_KEY);

    if (data) {
      const object = JSON.parse(data);
      set({
        token: object.token,
        authenticated: true,
        user_id: object._id,
        initialized: true,
      });
    } else {
      set({initialized: true});
    }
  },
  // login
  login: async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/volunteers/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message || "Login failed");
      }
      set({
        token: json.token,
        authenticated: true,
        user_id: json.user.id,
      });

      await SecureStore.setItemAsync(TOKEN_KEY, JSON.stringify(json));
      return json;
    } catch (e) {
      console.error("Login Error", e);
      return {
        error: true,
        msg: e instanceof Error ? e.message : "An error occurred",
      };
    }
  },

  // logout
  logout: async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    set({
      token: null,
      authenticated: false,
      user_id: null,
    });
  },

  // register
  register: async (
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    password: string,
    address: string,
    barangay: string,
    city: string,
    gender: string,
    dateOfBirth: string
  ) => {
    try {
      const result = await fetch(`${API_URL}/volunteers/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          password,
          address,
          barangay,
          city,
          gender,
          dateOfBirth,
        }),
      });

      const json = await result.json();

      if (!result.ok) {
        throw new Error(json.message || "Registration failed");
      }

      set({
        token: json.token,
        authenticated: true,
        user_id: json.user.id,
      });

      const userData = {
        token: json.token,
        user: {
          id: json.user.id,
          email: json.email,
        },
      };

      await SecureStore.setItemAsync(TOKEN_KEY, JSON.stringify(userData));
      return userData;
    } catch (e) {
      console.error("Registration error:", e);
      return {
        error: true,
        msg:
          e instanceof Error
            ? e.message
            : "An error occurred during registration",
      };
    }
  },
}));
