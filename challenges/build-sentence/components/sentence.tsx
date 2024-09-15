import { Button as ShadButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SentenceFramerAnimationConfig } from "@/types/framer/sentence-animation-config";
import { SentenceWord } from "@/types/Game";
import { motion, Reorder } from "framer-motion";
import { Dispatch, SetStateAction, useRef } from "react";

export const Sentence = (props: {
  words: SentenceWord[];
  setWords: (words: SentenceWord[]) => void;
  setSentence: Dispatch<SetStateAction<SentenceWord[]>>;
  sentence: SentenceWord[];
  animationConfig: SentenceFramerAnimationConfig;
}) => {
  const Button = motion.create(ShadButton);
  const { sentence, setSentence, words, setWords, animationConfig } = props;

  const limits = useRef(null);

  const removeFromSentence = (word: SentenceWord) => {
    const newWords = [...words];
    newWords[word.id].isAvailable = true;
    setWords(newWords);
    setSentence((prevSelected) => prevSelected.filter((w) => w !== word));
  };

  return (
    <div className="h-[200px] relative z-20" ref={limits}>
      <div className="absolute top-[44px] left-0 w-full bg-slate-200 h-[2px]"></div>
      <div className="absolute top-[94px] left-0 w-full bg-slate-200 h-[2px]"></div>
      <div className="absolute top-[144px] left-0 w-full bg-slate-200 h-[2px]"></div>
      <Reorder.Group
        onReorder={setSentence}
        values={sentence}
        axis="x"
        drag
        /*
          bug: using flex-wrap cause items to reoder in unexpected ways,
          while removing flex-wrap fixes the issue, its not a solution as we need to wrap
          items when we exceed screen width
        */
        className={cn(
          "flex gap-[10px] content-start",
          "h-[200px]",
          // "flex-wrap",
        )}
      >
        {sentence.map((word) => (
          <Reorder.Item value={word} key={word.id}>
            <Button
              onClick={() => {
                removeFromSentence(word);
              }}
              variant="game"
              className="z-30"
              transition={animationConfig}
              layoutId={word.id.toString()}
            >
              {word.text}
            </Button>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
};
