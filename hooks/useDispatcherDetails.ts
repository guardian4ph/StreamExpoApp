import {useState, useEffect} from "react";

interface DispatcherDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  barangay: string;
  city: string;
}

export const useDispatcherDetails = (dispatcherId: string | null) => {
  const [dispatcher, setDispatcher] = useState<DispatcherDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDispatcherDetails = async () => {
      if (!dispatcherId) {
        setDispatcher(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/users/${dispatcherId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch dispatcher details");
        }

        const data = await response.json();
        setDispatcher(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setDispatcher(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDispatcherDetails();
  }, [dispatcherId]);

  return {dispatcher, isLoading, error};
};
