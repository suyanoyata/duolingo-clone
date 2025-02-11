import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

export const SelectImageChallengePreview = ({
  challenge,
}: {
  challenge: {
    question: string;
    correct: string;
    words: {
      image: string;
      word: string;
    }[];
  };
}) => {
  const [selected, setSelected] = useState("");
  const [answerState, setAnswerState] = useState<
    undefined | "correct" | "incorrect"
  >();

  useEffect(() => {
    setAnswerState(undefined);
  }, [selected]);

  const submitResult = () => {
    selected === challenge.correct
      ? setAnswerState("correct")
      : setAnswerState("incorrect");
  };

  return (
    <motion.div
      initial={{ opacity: 0, translateX: 60 }}
      transition={{
        ease: "easeOut",
        duration: 0.4,
      }}
      animate={{ opacity: 1, translateX: 0 }}
      exit={{ opacity: 0, translateX: 60 }}
    >
      <h2 className="text-zinc-600 text-xl font-extrabold">
        Перекладіть наступне речення
      </h2>
      <h1 className="text-2xl text-zinc-800 mb-3 font-extrabold">
        {challenge.question}
      </h1>
      <div className="flex gap-3 mb-2 justify-center">
        {challenge.words.map((option, index) => (
          <Button
            onClick={() => {
              setSelected(option.word);
            }}
            variant="game"
            size="icon"
            className={cn(
              "h-40 w-40 flex-col p-2",
              option.word === selected &&
                "border-green-300 bg-green-400/20 hover:bg-green-400/20 text-green-400",
              answerState == "incorrect" &&
                option.word === selected &&
                "bg-red-400/20 text-red-400 hover:bg-red-400/20 border-red-300"
            )}
            key={index}
          >
            <Image
              priority
              width={175}
              height={175}
              className="object-fit mix-blend-multiply w-[175px] h-[175px] scale-75"
              alt=""
              src={option.image}
            />
            {option.word}
          </Button>
        ))}
      </div>
      <Button
        onClick={() => {
          submitResult();
        }}
        variant="primary"
        className="max-sm:w-full"
      >
        Відповісти
      </Button>
    </motion.div>
  );
};
