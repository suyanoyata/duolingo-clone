import { ChallengeType, Select, Sentence, User } from "@prisma/client";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { clientStore } from "@/store/user-store";
import { useQuery } from "@tanstack/react-query";
import { reduceHearts } from "@/actions/users/user.action";
import { motion } from "framer-motion";

type Challenge = {
  id: number;
  order: number;
  lessonId: number;
  type: "SELECT" | "SENTENCE";
  Select: Select[];
  Sentence: Sentence[];
};

export const SelectChallenge = ({
  challenge,
  index,
  length,
  isPreviousChallengeCompleting,
  setCompleted,
}: {
  index: number;
  challenge: Challenge;
  length: number;
  isPreviousChallengeCompleting: boolean | undefined;
  setCompleted: (value: boolean) => void;
}) => {
  const { currentChallengeIndex, setCurrentChallengeIndex } = clientStore();

  const [selected, setSelected] = useState("");
  const [answerState, setAnswerState] = useState<
    undefined | "correct" | "incorrect"
  >();

  const { data: user } = useQuery<User>({
    queryKey: ["user"],
  });

  const { refetch } = useQuery({
    queryKey: ["user"],
  });

  const correctAnswerDispatch = () => {
    setCurrentChallengeIndex(currentChallengeIndex + 1);
    if (currentChallengeIndex + 1 === length) {
      setCompleted(true);
    }
  };

  useEffect(() => {
    if (answerState == "incorrect") {
      reduceHearts().then(() => refetch());
    }
    if (answerState == "correct") {
      correctAnswerDispatch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answerState, refetch]);

  useEffect(() => {
    setAnswerState(undefined);
  }, [selected]);

  if (challenge.type !== ChallengeType.SELECT || challenge.Select.length == 0) {
    return null;
  }

  const challengeVariants = challenge.Select[0];

  const submitResult = () => {
    selected === challengeVariants.answer
      ? setAnswerState("correct")
      : setAnswerState("incorrect");
  };

  if (currentChallengeIndex !== index) return null;

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
        {challengeVariants?.question}
      </h1>
      <div className="flex-col flex gap-2 mb-2">
        {challengeVariants?.options.map((option, index) => (
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
                "bg-red-400/20 text-red-400 hover:bg-red-400/20 border-red-300",
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
        disabled={
          selected == "" ||
          (user && user.hearts <= 0 && !isPreviousChallengeCompleting)
        }
        variant="primary"
        className="max-sm:w-full"
      >
        Відповісти
      </Button>
    </motion.div>
  );
};
