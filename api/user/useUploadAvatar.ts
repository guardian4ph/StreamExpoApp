import {useMutation} from "@tanstack/react-query";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const uploadProfileImage = async ({
  userId,
  file,
}: {
  userId: string;
  file: any;
}) => {
  const formData = new FormData();
  formData.append("profileImage", file);

  const response = await fetch(
    `${API_URL}/volunteers/upload-profile/${userId}`,
    {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to upload profile image");
  }

  return response.json();
};

export const useUploadAvatar = () => {
  return useMutation({
    mutationFn: uploadProfileImage,
    onError: (error: Error) => {
      console.error("Error uploading profile image: ", error.message);
    },
  });
};
