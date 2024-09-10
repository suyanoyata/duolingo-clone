import { SentenceWord } from "@/types/Game";
import { useEffect, useRef, useState } from "react";

export const useTextToSpeech = (words: SentenceWord[]) => {
  const [word, setWord] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCache = useRef<Map<string, HTMLAudioElement>>(new Map());

  useEffect(() => {
    const prefetchAudio = async () => {
      words.forEach((word) => {
        const audioUrl = `https://d7mj4aqfscim2.cloudfront.net/tts/en/token/${word.text.toLowerCase()}`;
        const audio = new Audio(audioUrl);
        audioCache.current.set(word.text.toLowerCase(), audio);
      });
    };

    prefetchAudio();

    return () => {
      audioCache.current.forEach((audio) => {
        audio.pause();
        audio.src = "";
      });
      audioCache.current.clear();
    };
  }, [words]);

  useEffect(() => {
    if (word) {
      const playAudio = () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }

        const cachedAudio = audioCache.current.get(word.toLowerCase());
        if (cachedAudio) {
          audioRef.current = cachedAudio;
          cachedAudio.play();
        }
      };

      playAudio();
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [word]);

  return { setWord };
};
