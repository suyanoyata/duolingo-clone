import { Button as ShadButton } from "@/components/ui/button";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { motion } from "framer-motion";
import { Dispatch, SetStateAction } from "react";

export const WordPicker = (props: {
  words: never[];
  animationConfig: never;
  setWords: (words: never[]) => void;
  setSentence: Dispatch<SetStateAction<never[]>>;
}) => {
  const { words, animationConfig, setWords, setSentence } = props;
  const Button = motion.create(ShadButton);

  const { setWord } = useTextToSpeech(words);

  const addWordToSentence = (word: never) => {
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
              className="z-20 absolute top-0 left-0"
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
