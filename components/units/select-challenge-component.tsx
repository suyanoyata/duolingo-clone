import { ChallengeType, User } from "@prisma/client";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { clientStore } from "@/store/user-store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { increaseLessonProgress } from "@/actions/courses/courses.action";
import { reduceHearts } from "@/actions/users/user.action";
import { motion } from "framer-motion";

type Challenge = {
  id: number;
  order: number;
  lessonId: number;
  type: "SELECT";
  Select: SelectChallenge[];
};

type SelectChallenge = {
  id: number;
  challengeId: number;
  question: string;
  options: string[];
  answer: string;
};

export const SelectChallenge = ({
  challenge,
  index,
  length,
}: {
  index: number;
  challenge: Challenge;
  length: number;
}) => {
  const {
    lastLanguageCode,
    lessonId,
    currentChallengeIndex,
    setCurrentChallengeIndex,
  } = clientStore();

  const queryClient = useQueryClient();

  const [selected, setSelected] = useState("");
  const [answerState, setAnswerState] = useState<
    undefined | "correct" | "incorrect"
  >();

  const { mutate: increaseLessonIndex } = useMutation({
    mutationKey: ["current-user-courses"],
    mutationFn: async () => {
      await increaseLessonProgress(lessonId, lastLanguageCode);
    },
    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: ["current-user-courses"],
      });
    },
  });

  const { data: user } = useQuery<User>({
    queryKey: ["user"],
  });

  const { refetch } = useQuery({
    queryKey: ["user"],
  });

  const correctAnswerDispatch = () => {
    setCurrentChallengeIndex(currentChallengeIndex + 1);
    if (currentChallengeIndex + 1 === length) {
      increaseLessonIndex();
    }
  };

  useEffect(() => {
    if (answerState == "incorrect") {
      reduceHearts().then(() => refetch());
    }
    if (answerState == "correct") {
      correctAnswerDispatch();
    }
  }, [answerState, refetch]);

  if (challenge.type !== ChallengeType.SELECT || challenge.Select.length == 0) {
    return null;
  }

  const challengeVariants = challenge.Select[0];

  const submitResult = async () => {
    if (selected === challengeVariants.answer) {
      setAnswerState("correct");
    } else {
      setAnswerState("incorrect");
    }
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
        disabled={selected == "" || (user && user.hearts <= 0)}
        variant="primary"
        className="max-sm:w-full"
      >
        Відповісти
      </Button>
    </motion.div>
  );
};
