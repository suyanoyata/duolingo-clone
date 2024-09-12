import { User } from "@/types/User";
import { create } from "zustand";

interface UserStore {
  user: User | null;
  isPending: boolean;
  setUser: (user: User) => void;
  setIsPending(isPending: boolean): void;
}

export const clientStore = create<UserStore>((set) => ({
  user: null,
  isPending: true,
  setUser: (user) => set({ user }),
  setIsPending: (isPending) => set({ isPending }),
}));
