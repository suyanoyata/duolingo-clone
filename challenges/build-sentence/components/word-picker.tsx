import { Button as ShadButton } from "@/components/ui/button";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { SentenceFramerAnimationConfig } from "@/types/framer/sentence-animation-config";
import { SentenceWord } from "@/types/Game";
import { motion } from "framer-motion";
import { Dispatch, SetStateAction, useEffect } from "react";

export const WordPicker = (props: {
  words: SentenceWord[];
  animationConfig: SentenceFramerAnimationConfig;
  setWords: (words: SentenceWord[]) => void;
  setSentence: Dispatch<SetStateAction<SentenceWord[]>>;
}) => {
  const { words, animationConfig, setWords, setSentence } = props;
  const Button = motion.create(ShadButton);

  const { setWord } = useTextToSpeech(words);

  useEffect(() => {
    console.log(words);
  }, [words]);

  const addWordToSentence = (word: SentenceWord) => {
    const newWords = [...words];
    newWords[word.id].isAvailable = false;
    setWords(newWords);
    setWord(word.text);
    setSentence((prevSelected) => [...prevSelected, word]);
  };

  return (
    <div className="flex gap-3 mt-5 flex-wrap">
      {words.map((word) => (
        <div key={word.id} className="relative">
          {word.isAvailable && (
            <Button
              suppressHydrationWarning={true}
              variant="game"
              transition={animationConfig}
              className="z-40 absolute top-0 left-0"
              layoutId={word.id.toString()}
              onClick={() => addWordToSentence(word)}
            >
              {word.text}
            </Button>
          )}
          <div className="text-white/0 bg-slate-100 cursor-default h-10 px-[19px] first-line:py-2 rounded-xl z-10 relative select-none">
            {word.text}
          </div>
        </div>
      ))}
    </div>
  );
};
