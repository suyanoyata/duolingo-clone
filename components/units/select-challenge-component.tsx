import { ChallengeType } from "@prisma/client";
import { Button } from "../ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { clientStore } from "@/store/user-store";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { increaseLessonProgress } from "@/actions/courses/courses.action";
import { toast } from "sonner";

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
  const { currentChallengeIndex, setCurrentChallengeIndex } = clientStore();
  const [selected, setSelected] = useState("");

  const router = useRouter();

  const { mutate: increaseLessonIndex } = useMutation({
    mutationKey: ["current-user-courses"],
    mutationFn: async () => {
      await increaseLessonProgress(lessonId, lastLanguageCode);
    },
  });

  if (challenge.type !== ChallengeType.SELECT || challenge.Select.length == 0) {
    return null;
  }

  const challengeVariants = challenge.Select[0];

  const submitResult = () => {
    if (selected === challengeVariants.answer) {
      correctAnswerDispatch();
    } else {
      toast.error("Implement incorrect answer");
    }
  };

  const correctAnswerDispatch = () => {
    if (currentChallengeIndex + 1 === length) {
      increaseLessonIndex();
      router.push(`/learn/${lastLanguageCode}`);
    } else {
      setCurrentChallengeIndex(currentChallengeIndex + 1);
    }
  };

  const { lastLanguageCode, lessonId } = clientStore();

  if (currentChallengeIndex !== index) {
    return null;
  }

  return (
    <div>
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
              option === selected &&
                "bg-green-400 border-green-500 text-white hover:bg-green-400",
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
      >
        Відповісти
      </Button>
    </div>
  );
};
