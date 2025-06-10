import {useMutation} from "@tanstack/react-query";
import {User} from "@/types/User";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const updateUserData = async ({
  userId,
  data,
}: {
  userId: string;
  data: Partial<User>;
}) => {
  const response = await fetch(`${API_URL}/volunteers/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update volunteer");
  }

  return response.json();
};

export const useUpdateUserData = () => {
  return useMutation({
    mutationFn: updateUserData,
    onError: (error: Error) => {
      console.error("Error updating volunteer: ", error.message);
    },
  });
};
