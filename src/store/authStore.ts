// src/store/authStore.ts
// Global auth state using Zustand

import { create } from "zustand";
import { User, Student, Parent } from "@/types";

interface AuthState {
  user: User | null;
  student: Student | null;
  parent: Parent | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setStudent: (student: Student | null) => void;
  setParent: (parent: Parent | null) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  student: null,
  parent: null,
  isLoading: true,

  setUser: (user) => set({ user }),
  setStudent: (student) => set({ student }),
  setParent: (parent) => set({ parent }),
  setLoading: (isLoading) => set({ isLoading }),

  reset: () =>
    set({ user: null, student: null, parent: null, isLoading: false }),
}));
