import { Button as ShadButton } from "@/components/ui/button";
import { SentenceFramerAnimationConfig } from "@/types/framer/sentence-animation-config";
import { SentenceWord } from "@/types/Game";
import { motion } from "framer-motion";
import { Dispatch, SetStateAction } from "react";

export const Sentence = (props: {
  words: SentenceWord[];
  setWords: (words: SentenceWord[]) => void;
  setSentence: Dispatch<SetStateAction<SentenceWord[]>>;
  sentence: SentenceWord[];
  animationConfig: SentenceFramerAnimationConfig;
}) => {
  const Button = motion.create(ShadButton);
  const { sentence, setSentence, words, setWords, animationConfig } = props;

  const removeFromSentence = (word: SentenceWord) => {
    const newWords = [...words];
    newWords[word.id].isAvailable = true;
    setWords(newWords);
    setSentence((prevSelected) => prevSelected.filter((w) => w !== word));
  };

  return (
    <div className="h-[150px] flex gap-2 flex-wrap content-start z-50">
      {sentence.map((word) => (
        <Button
          key={word.id}
          onClick={() => {
            removeFromSentence(word);
          }}
          animate={{
            zIndex: 50,
          }}
          variant="game"
          className="z-40"
          transition={animationConfig}
          layoutId={word.id.toString()}
        >
          {word.text}
        </Button>
      ))}
    </div>
  );
};
