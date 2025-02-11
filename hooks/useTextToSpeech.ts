import { SentenceWord } from "@/types/Game";
import { useEffect, useRef, useState } from "react";

export const useTextToSpeech = (
  words: SentenceWord[],
  disableNarrator: boolean = false
) => {
  const sentenceWords = words.map((word) => {
    const clearWord = word.text.replace(/[^a-zA-Z]/g, "");

    return clearWord.toLowerCase();
  });
  const [word, setWord] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCache = useRef<Map<string, HTMLAudioElement>>(new Map());

  useEffect(() => {
    const prefetchAudio = async () => {
      if (!disableNarrator) {
        sentenceWords.forEach((word) => {
          const audioUrl = `https://d7mj4aqfscim2.cloudfront.net/tts/en/token/${word}`;
          const audio = new Audio(audioUrl);
          audioCache.current.set(word.toLowerCase(), audio);
        });
      }
    };

    prefetchAudio();

    return () => {
      audioCache.current.forEach((audio) => {
        audio.pause();
        audio.src = "";
      });
      audioCache.current.clear();
    };
  }, [sentenceWords]);

  useEffect(() => {
    if (word && !disableNarrator) {
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
  }, [word, disableNarrator]);

  return { setWord };
};
