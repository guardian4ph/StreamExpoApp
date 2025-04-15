import {useEffect, useState} from "react";
import {Audio} from "expo-av";

export const useSound = (soundFile: any) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  async function playSound() {
    try {
      const {sound} = await Audio.Sound.createAsync(soundFile);
      setSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  }

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return {playSound};
};
