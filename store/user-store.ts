import { create } from "zustand";

interface UserStore {
  lessonId: number;
  currentChallengeIndex: number;
  isPreviousChallengeCompleting: boolean | undefined;
  lastLanguageCode: string;
  setLessonId: (lessonId: number) => void;
  setPreviousChallengeCompleting: (
    isPreviousChallengeCompleting: boolean,
  ) => void;
  setCurrentChallengeIndex: (currentChallengeIndex: number) => void;
  setLastLanguageCode: (lastLanguageCode: string) => void;
}

export const clientStore = create<UserStore>((set) => ({
  lessonId: 0,
  currentChallengeIndex: 0,
  isPreviousChallengeCompleting: undefined,
  lastLanguageCode: "",
  setLessonId: (lessonId: number) => set({ lessonId }),
  setPreviousChallengeCompleting: (isPreviousChallengeCompleting: boolean) =>
    set({ isPreviousChallengeCompleting }),
  setCurrentChallengeIndex: (currentChallengeIndex: number) =>
    set({ currentChallengeIndex }),
  setLastLanguageCode: (lastLanguageCode: string) => set({ lastLanguageCode }),
}));
