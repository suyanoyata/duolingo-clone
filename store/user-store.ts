import { create } from "zustand";

interface UserStore {
  lessonId: number;
  currentChallengeIndex: number;
  lastLanguageCode: string;
  setLessonId: (lessonId: number) => void;
  setCurrentChallengeIndex: (currentChallengeIndex: number) => void;
  setLastLanguageCode: (lastLanguageCode: string) => void;
}

export const clientStore = create<UserStore>((set) => ({
  lessonId: 0,
  currentChallengeIndex: 0,
  lastLanguageCode: "",
  setLessonId: (lessonId: number) => set({ lessonId }),
  setCurrentChallengeIndex: (currentChallengeIndex: number) =>
    set({ currentChallengeIndex }),
  setLastLanguageCode: (lastLanguageCode: string) => set({ lastLanguageCode }),
}));
