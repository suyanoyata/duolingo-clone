import { LayoutGroup, motion } from "framer-motion";
import { useState } from "react";

import { SentenceWord } from "@/types/Game";

import { Sentence as SentenceChallengeComponent } from "@/components/sentence";
import { SentenceWordPicker } from "@/components/sentence-word-picker";
import { Button } from "@/components/ui/button";

import { animationConfig } from "@/constants/animation-config";

export const SentenceChallengePreview = ({
  sentence,
}: {
  sentence: {
    words: string[];
    correct: string[];
    question: string;
  };
}) => {
  const words = [
    ...sentence.words.map((word, index) => ({
      id: index,
      text: word,
      isAvailable: true,
    })),
    ...sentence.correct.map((word, index) => ({
      id: sentence.words.length + index,
      text: word,
      isAvailable: true,
    })),
  ];

  const [sentenceWords, setSentenceWords] = useState<SentenceWord[]>(words);
  const [userSentence, setUserSentence] = useState<SentenceWord[]>([]);

  return (
    <motion.div>
      <div>
        <h2 className="text-zinc-600 text-xl font-extrabold">
          Складіть наступне речення
        </h2>
        <h1 className="text-2xl text-zinc-800 mb-3 font-extrabold">
          {sentence.question}
        </h1>
      </div>
      <div className="flex-col flex gap-2 mb-2">
        <LayoutGroup>
          <SentenceChallengeComponent
            words={sentenceWords}
            setWords={setSentenceWords}
            setSentence={setUserSentence}
            animationConfig={animationConfig}
            sentence={userSentence}
          />
          <SentenceWordPicker
            words={sentenceWords}
            setWords={setSentenceWords}
            setSentence={setUserSentence}
            animationConfig={animationConfig}
            disableNarrator
          />
        </LayoutGroup>
      </div>
      <Button variant="primary" className="max-sm:w-full">
        Відповісти
      </Button>
    </motion.div>
  );
};
