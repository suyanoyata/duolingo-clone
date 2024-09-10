"use client";

import { LayoutGroup } from "framer-motion";
import { useEffect, useState } from "react";
import { SentenceWord } from "@/types/Game";
import { WordPicker } from "@/challenges/build-sentence/components/word-picker";
import { Sentence } from "@/challenges/build-sentence/components/sentence";
import { useQuery } from "@tanstack/react-query";
import { getRandomSentence } from "@/actions/challenge/challenge.action";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const animationConfig = {
  ease: "easeOut",
  type: "spring",
  duration: 0.5,
};

export default function Page() {
  const [words, setWords] = useState<SentenceWord[]>([]);
  const [sentence, setSentence] = useState<SentenceWord[]>([]);

  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [dirty, setDirty] = useState<boolean>(false);

  const { data } = useQuery({
    queryKey: ["random_sentence", "en"],
    queryFn: async () => await getRandomSentence("en"),
    refetchOnWindowFocus: false,
  });

  const checkSubmit = () => {
    setDirty(false);
    let answer = "";
    sentence.map((word) => {
      answer += word.text + " ";
    });
    if (answer.trim() == data!.correct) {
      setIsCorrect(true);
    }
  };

  useEffect(() => {
    if (data != null || data != undefined) {
      setWords(
        data.sentence!.map((word, index) => ({
          text: word,
          isAvailable: true,
          id: index,
        })),
      );
    }
  }, [data]);

  const AnswerDispatch = () => {
    if (!dirty) {
      return (
        <p
          className={cn(
            !isCorrect && "text-red-400",
            isCorrect && "text-green-400",
            "font-bold",
          )}
        >{`It's ${isCorrect ? "correct!" : "incorrect"}`}</p>
      );
    }
  };

  useEffect(() => {
    setDirty(true);
    setIsCorrect(false);
  }, [sentence]);

  if (!data) return;

  return (
    <div className="p-2 mx-auto max-w-[600px] min-w-[330px]">
      <div className="min-h-[240px] flex flex-col">
        <h1 className="text-3xl mb-2 font-extrabold max-[360px]:text-xl">
          {data.translate}
        </h1>
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
        <div className="flex flex-row items-center mt-3">
          <AnswerDispatch />
          <Button
            onClick={checkSubmit}
            variant="primary"
            className="mt-2 ml-auto"
          >
            Submit
          </Button>
        </div>
        {/* <p className="text-xs font-medium mt-2 font-mono whitespace-pre-wrap">
          Current animation config: {JSON.stringify(animationConfig, null, 2)}
        </p> */}
      </div>
    </div>
  );
}
