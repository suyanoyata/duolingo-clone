import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export const SelectChallengePreview = ({
  select,
}: {
  select: {
    options: string[];
    answer: string;
    question: string;
  };
}) => {
  const [selected, setSelected] = useState(select.answer);
  const [answerState, setAnswerState] = useState<
    undefined | "correct" | "incorrect"
  >();

  useEffect(() => {
    setAnswerState(undefined);
  }, [selected]);

  const submitResult = () => {
    selected === select.answer
      ? setAnswerState("correct")
      : setAnswerState("incorrect");
  };

  return (
    <motion.div>
      <h2 className="text-zinc-600 text-xl font-extrabold">
        Перекладіть наступне речення
      </h2>
      <h1 className="text-2xl text-zinc-800 mb-3 font-extrabold">
        {select?.question}
      </h1>
      <div className="flex-col flex gap-2 mb-2">
        {select?.options.map((option, index) => (
          <Button
            onClick={() => {
              setSelected(option);
            }}
            variant="game"
            className={cn(
              "h-12",
              option === selected &&
                "border-green-300 bg-green-400/20 hover:bg-green-400/20 text-green-400",
              answerState == "incorrect" &&
                option === selected &&
                "bg-red-400/20 text-red-400 hover:bg-red-400/20 border-red-300"
            )}
            key={index}
          >
            {option}
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
