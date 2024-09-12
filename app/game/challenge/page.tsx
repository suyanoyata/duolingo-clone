"use client";

import { LayoutGroup } from "framer-motion";
import { useEffect, useState } from "react";
import { SentenceWord } from "@/types/Game";
import { WordPicker } from "@/challenges/build-sentence/components/word-picker";
import { Sentence } from "@/challenges/build-sentence/components/sentence";
import { useQuery } from "@tanstack/react-query";
import { getRandomSentence } from "@/actions/challenge/challenge.action";
import { SubmitChallenge } from "@/challenges/submit-challenge";
import { clientStore } from "@/store/user-store";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const animationConfig = {
  ease: "easeOut",
  type: "spring",
  duration: 0.3,
};

export default function Page() {
  const [words, setWords] = useState<SentenceWord[]>([]);
  const [sentence, setSentence] = useState<SentenceWord[]>([]);

  const { user } = clientStore();

  const { data } = useQuery({
    queryKey: ["random_sentence", "en"],
    queryFn: async () => await getRandomSentence("en"),
    refetchOnWindowFocus: false,
  });

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

  if (!data) return;

  return (
    <div className="p-2 mx-auto max-w-[600px] min-w-[330px]">
      <div className="min-h-[240px] flex flex-col">
        <Button variant="ghost" className="gap-1 self-start" size="sm">
          {user?.hearts} <Heart strokeWidth={0} className="fill-red-500" />
        </Button>
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
        <SubmitChallenge sentence={sentence} correct={data!.correct} />
        {/* <p className="text-xs font-medium mt-2 font-mono whitespace-pre-wrap">
          Current animation config: {JSON.stringify(animationConfig, null, 2)}
        </p> */}
      </div>
    </div>
  );
}
