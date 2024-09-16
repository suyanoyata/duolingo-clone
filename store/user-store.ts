import { create } from "zustand";

interface UserStore {
  user: never | null;
  isPending: boolean;
  setUser: (user: never) => void;
  setIsPending(isPending: boolean): void;
}

export const clientStore = create<UserStore>((set) => ({
  user: null,
  isPending: true,
  setUser: (user) => set({ user }),
  setIsPending: (isPending) => set({ isPending }),
}));
