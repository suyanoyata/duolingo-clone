import { clientStore } from "@/store/user-store";
import { Challenge, ChallengeType, Sentence, User } from "@prisma/client";
import { LayoutGroup, motion } from "framer-motion";
import { Sentence as SentenceChallengeComponent } from "../sentence";
import { useEffect, useState } from "react";
import { SentenceWord } from "@/types/Game";
import { SentenceWordPicker } from "../sentence-word-picker";
import { animationConfig } from "@/constants/animation-config";
import { Button } from "../ui/button";
import { useQuery } from "@tanstack/react-query";
import { reduceHearts } from "@/actions/users/user.action";

export const SentenceChallenge = ({
  challenge,
  index,
  length,
  setCompleted,
}: {
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
  const { data: user, refetch } = useQuery<User>({
    queryKey: ["user"],
  });
  const [sentenceWords, setSentenceWords] = useState<SentenceWord[]>([]);
  const [userSentence, setUserSentence] = useState<SentenceWord[]>([]);
  const [answerState, setAnswerState] = useState<
    "correct" | "incorrect" | undefined
  >();

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
    console.log(userSentence, userSentence.length);
  }, [userSentence]);

  useEffect(() => {
    setAnswerState(undefined);
  }, [userSentence]);

  const submitResult = () => {
    const correct = challenge.Sentence[0].correct.join(" ");
    const user = userSentence.map((word) => word.text).join(" ");

    setAnswerState(correct === user ? "correct" : "incorrect");
  };

  useEffect(() => {
    if (answerState == "correct") {
      setCurrentChallengeIndex(currentChallengeIndex + 1);
      if (currentChallengeIndex + 1 === length) {
        setCompleted(true);
      }
    }

    if (answerState == "incorrect") {
      reduceHearts().then(() => refetch());
    }
  }, [answerState, length]);

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
