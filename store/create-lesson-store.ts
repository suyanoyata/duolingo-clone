import { ChallengeType } from "@prisma/client";
import { create } from "zustand";

interface UserStore {
  challengeType: ChallengeType | undefined;
  question: string;
  answer: string;
  correct: string[];
  setChallengeType: (challengeType: ChallengeType) => void;
  setQuestion: (question: string) => void;
  setAnswer: (answer: string) => void;
  setCorrect: (correct: string[]) => void;
}

export const createChallengeStore = create<UserStore>((set) => ({
  challengeType: undefined,
  question: "",
  answer: "",
  correct: [],
  setChallengeType: (challengeType: ChallengeType) => set({ challengeType }),
  setQuestion: (question: string) => set({ question }),
  setAnswer: (answer: string) => set({ answer }),
  setCorrect: (correct: string[]) => set({ correct }),
}));
