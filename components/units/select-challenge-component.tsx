import { Challenge, ChallengeType, Select, User } from "@prisma/client";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { clientStore } from "@/store/user-store";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { GameLesson } from "@/types/Game";
import { useLessonEdit } from "@/hooks/useLessonEdit";
import { useReduceHearts } from "@/hooks/useReduceHearts";

export const SelectChallenge = ({
  lessonId,
  challenge,
  index,
  isPreviousChallengeCompleting,
}: {
  lessonId: number;
  index: number;
  challenge: Challenge & {
    Select: Select[];
  };
  isPreviousChallengeCompleting: boolean | undefined;
}) => {
  const { currentChallengeIndex, setCurrentChallengeIndex } = clientStore();

  const { data: lesson } = useQuery<GameLesson[]>({
    queryKey: ["lesson", lessonId],
  });

  const { editLesson } = useLessonEdit(lesson!, index, lessonId);
  const { reduceUserHearts } = useReduceHearts();

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
  };

  useEffect(() => {
    if (answerState == "incorrect") {
      editLesson();
      reduceUserHearts();
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
