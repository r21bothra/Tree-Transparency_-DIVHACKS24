import { create } from "zustand";

export const useUserStore = create((set) => ({
  userStore: { username: "", phone: "", type: "", email: "" },
  setUser: (user) => {
    set((state) => ({ userStore: { ...state.userStore, ...user } }));
  },
  clear: () => {
    set({ userStore: { username: "", phone: "", type: "", email: "" } });
  },
}));
