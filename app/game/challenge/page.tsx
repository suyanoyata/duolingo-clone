"use client";

import { LayoutGroup } from "framer-motion";
import { useEffect, useState } from "react";
import { SentenceWord } from "@/types/Game";
import { WordPicker } from "@/challenges/build-sentence/components/word-picker";
import { Sentence } from "@/challenges/build-sentence/components/sentence";
import { useQuery } from "@tanstack/react-query";
import { getRandomSentence } from "@/actions/challenge/challenge.action";

// const startWords = [
//   "The",
//   "quick",
//   "brown",
//   "fox",
//   "jumps",
//   "over",
//   "the",
//   "lazy",
//   "dog",
// ];

const animationConfig = {
  ease: "easeOut",
  type: "spring",
  duration: 0.5,
};

export default function Page() {
  const [words, setWords] = useState<SentenceWord[]>(
    [],
    // shuffle(startWords).map((word, index) => ({
    //   text: word,
    //   isAvailable: true,
    //   id: index,
    // })),
  );

  const { data } = useQuery({
    queryKey: ["random_sentence"],
    queryFn: async () => await getRandomSentence(),
  });

  useEffect(() => {
    if (data != null || data != undefined) {
      setWords(
        data.split(" ").map((word, index) => ({
          text: word,
          isAvailable: true,
          id: index,
        })),
      );
    }
  }, [data]);

  const [sentence, setSentence] = useState<SentenceWord[]>([]);

  return (
    <div className="p-2 mx-auto max-w-[600px] min-w-[330px]">
      <div className="h-[240px]">
        <LayoutGroup>
          <Sentence
            words={words}
            sentence={sentence}
            setWords={setWords}
            setSentence={setSentence}
            animationConfig={animationConfig}
          />
          <WordPicker
            words={words}
            setWords={setWords}
            setSentence={setSentence}
            animationConfig={animationConfig}
          />
        </LayoutGroup>
        {/* <p className="text-xs font-medium mt-2 font-mono whitespace-pre-wrap">
          Current animation config: {JSON.stringify(animationConfig, null, 2)}
        </p> */}
      </div>
    </div>
  );
}
