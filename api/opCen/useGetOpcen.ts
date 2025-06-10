import {useQuery} from "@tanstack/react-query";
import {OpCen} from "@/types/opCen";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

/// get opcen info
async function getOpcenInfo(opcenId: string): Promise<OpCen> {
  try {
    const response = await fetch(`${API_URL}/opcens/${opcenId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch Opcen info with id ${opcenId}`);
    }
    return await response.json();
  } catch (error: any) {
    console.error("Error fetching Opcen info:", error.message);
    throw new Error("Failed to fetch Opcen info");
  }
}

export const useGetOpcen = (opcenId: string) => {
  return useQuery({
    queryKey: ["opcen", opcenId],
    queryFn: () => getOpcenInfo(opcenId),
    enabled: !!opcenId,
  });
};
