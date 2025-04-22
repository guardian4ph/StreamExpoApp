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

  useEffect(() => {
    const fetchDispatcherDetails = async () => {
      if (!dispatcherId) {
        setDispatcher(null);
        return;
      }

      try {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/users/${dispatcherId}`
        );

        if (!response.ok) {
          setDispatcher(null);
          return;
        }

        const data = await response.json();
        setDispatcher(data);
      } catch (err) {
        setDispatcher(null);
      }
    };

    fetchDispatcherDetails();
  }, [dispatcherId]);

  return dispatcher;
};
