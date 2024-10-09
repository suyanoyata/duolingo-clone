import { clientStore } from "@/store/user-store";
import { Challenge, ChallengeType, Sentence, User } from "@prisma/client";
import { LayoutGroup, motion } from "framer-motion";
import { Sentence as SentenceChallengeComponent } from "../sentence";
import { useEffect, useState } from "react";
import { GameLesson, SentenceWord } from "@/types/Game";
import { SentenceWordPicker } from "../sentence-word-picker";
import { animationConfig } from "@/constants/animation-config";
import { Button } from "../ui/button";
import { useQuery } from "@tanstack/react-query";
import { useReduceHearts } from "@/hooks/useReduceHearts";
import { useLessonEdit } from "@/hooks/useLessonEdit";
import { compare } from "@/lib/utils";

export const SentenceChallenge = ({
  lessonId,
  challenge,
  index,
  length,
  setCompleted,
}: {
  lessonId: number;
  challenge: Challenge & {
    Sentence: Sentence[];
  };
  index: number;
  length: number;
  setCompleted: (value: boolean) => void;
}) => {
  const {
    currentChallengeIndex,
    isPreviousChallengeCompleting,
    setCurrentChallengeIndex,
  } = clientStore();
  const { data: user } = useQuery<User>({
    queryKey: ["user"],
  });

  const { data: lesson } = useQuery<GameLesson[]>({
    queryKey: ["lesson", lessonId],
  });

  const [sentenceWords, setSentenceWords] = useState<SentenceWord[]>([]);
  const [userSentence, setUserSentence] = useState<SentenceWord[]>([]);
  const [answerState, setAnswerState] = useState<
    "correct" | "incorrect" | undefined
  >();

  const { reduceUserHearts } = useReduceHearts();
  const { editLesson } = useLessonEdit(lesson!, index, lessonId);

  useEffect(() => {
    if (challenge.type === ChallengeType.SENTENCE) {
      setSentenceWords(
        challenge.Sentence[0].words.map((word, index) => ({
          id: index,
          text: word,
          isAvailable: true,
        })),
      );
    }
  }, [challenge.type, challenge.Sentence]);

  useEffect(() => {
    setAnswerState(undefined);
  }, [userSentence]);

  const submitResult = () => {
    const correct = compare(
      challenge.Sentence[0].correct,
      userSentence.map((word) => word.text),
    );

    setAnswerState(correct ? "correct" : "incorrect");
  };

  useEffect(() => {
    if (answerState == "correct") {
      setCurrentChallengeIndex(currentChallengeIndex + 1);
      if (currentChallengeIndex + 1 === length) {
        setCompleted(true);
      }
    }

    if (answerState == "incorrect") {
      editLesson();
      reduceUserHearts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answerState, length, isPreviousChallengeCompleting]);

  if (index !== currentChallengeIndex) return null;
  if (challenge.type !== ChallengeType.SENTENCE) return null;
  const sentence = challenge.Sentence[0];

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
      <div>
        <h2 className="text-zinc-600 text-xl font-extrabold">
          Складіть наступне речення
        </h2>
        <h1 className="text-2xl text-zinc-800 mb-3 font-extrabold">
          {sentence.question}
        </h1>
      </div>
      <div className="flex-col flex gap-2 mb-2">
        <LayoutGroup>
          <SentenceChallengeComponent
            sentence={userSentence}
            setSentence={setUserSentence}
            words={sentenceWords}
            setWords={setSentenceWords}
            animationConfig={animationConfig}
          />
          <SentenceWordPicker
            words={sentenceWords}
            setWords={setSentenceWords}
            setSentence={setUserSentence}
            animationConfig={animationConfig}
          />
        </LayoutGroup>
      </div>
      <Button
        onClick={() => {
          submitResult();
        }}
        disabled={
          userSentence.length == 0 ||
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
