import { User } from "@/types/User";
import { create } from "zustand";

interface UserStore {
  user: User | null;
  isPending: boolean;
  setUser: (user: User) => void;
  setIsPending(isPending: boolean): void;
}

interface ManagementStore {
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
}

export const clientStore = create<UserStore>((set) => ({
  user: null,
  isPending: true,
  setUser: (user) => set({ user }),
  setIsPending: (isPending) => set({ isPending }),
}));

export const managementStore = create<ManagementStore>((set) => ({
  selectedLanguage: "",
  setSelectedLanguage: (language) => set({ selectedLanguage: language }),
}));
