"use client";

import { addHeart, reduceHeart } from "@/actions/challenge/challenge.action";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { clientStore } from "@/store/user-store";
import { SentenceWord } from "@/types/Game";
import { useEffect, useState } from "react";

export const SubmitChallenge = ({
  sentence,
  correct,
}: {
  sentence: SentenceWord[];
  correct: string;
}) => {
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [dirty, setDirty] = useState<boolean>(true);
  const { user, setUser } = clientStore();
  const isPremium = false;

  const checkSubmit = () => {
    setDirty(false);
    const correct = compareSentence();
    setIsCorrect(correct);

    if (!correct) {
      setUser({
        ...user!,
        hearts: user!.hearts - 1,
      });
      reduceHeart().then((user) => {
        setUser(user);
      });
    } else {
      if (user!.hearts < 5) {
        setUser({
          ...user!,
          hearts: user!.hearts + 1,
        });
      }
      addHeart().then((user) => {
        if (user == null) return;
        setUser(user);
      });
    }
  };

  const compareSentence = () => {
    let answer = "";
    sentence.map((word) => {
      answer += word.text + " ";
    });
    return answer.trim() == correct;
  };

  const AnswerDispatch = () => {
    if (!dirty) {
      return (
        <p
          className={cn(
            !isCorrect && "text-red-400",
            isCorrect && "text-green-400",
            "font-bold select-none",
          )}
        >{`It's ${isCorrect ? "correct!" : "incorrect"}`}</p>
      );
    }
  };

  useEffect(() => {
    setDirty(true);
    setIsCorrect(false);
  }, [sentence]);

  return (
    <div className="flex flex-row items-center mt-3">
      <AnswerDispatch />
      <Button
        disabled={
          !dirty || sentence.length == 0 || (user?.hearts == 0 && !isPremium)
        }
        onClick={checkSubmit}
        variant="primary"
        className="mt-2 ml-auto"
      >
        Submit
      </Button>
    </div>
  );
};
