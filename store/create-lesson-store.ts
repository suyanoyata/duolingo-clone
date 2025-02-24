import { ChallengeType } from "@prisma/client";
import { create } from "zustand";

interface UserStore {
  open: boolean;
  setOpen: (state: boolean) => void;
  challengeType: ChallengeType | undefined;
  question: string;
  answer: string;
  correct: string[];
  setChallengeType: (challengeType: ChallengeType | undefined) => void;
  setQuestion: (question: string) => void;
  setAnswer: (answer: string) => void;
  setCorrect: (correct: string[]) => void;
}

export const createChallengeStore = create<UserStore>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  challengeType: undefined,
  question: "",
  answer: "",
  correct: [],
  setChallengeType: (challengeType) => set({ challengeType }),
  setQuestion: (question) => set({ question }),
  setAnswer: (answer) => set({ answer }),
  setCorrect: (correct) => set({ correct }),
}));
