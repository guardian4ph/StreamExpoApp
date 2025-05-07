import {useAuthStore} from "@/context/useAuthStore";
import {useState, useEffect} from "react";

interface UserInfo {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  phoneNumber?: string;
  address?: string;
  barangay?: string;
  city?: string;
  rating?: number;
  rank?: string;
  gender: string;
  followedLGUs: string[];
  profilePicture?: string;
}

export const useGetUserInfo = () => {
  const {user_id} = useAuthStore();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!user_id) {
        setLoading(false);
        setError("No user ID found");
        return;
      }

      try {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/volunteers/${user_id}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setUserInfo(data);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch user info"
        );
        setUserInfo(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [user_id]);

  return {userInfo, loading, error};
};
