import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

/**
 * Auth Store
 * Manages global authentication state
 * - User role (child/guardian)
 * - Auth token
 * - User profile
 * - Persisted via middleware (SecureStore/AsyncStorage)
 */

export interface User {
  id: string;
  email: string;
  name: string;
  role?: "child" | "guardian";
}

export interface AuthStoreState {
  // State
  token: string | null;
  user: User | null;
  role: "child" | "guardian" | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  setRole: (role: "child" | "guardian" | null) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStoreState>()(
  persist(
    (set) => ({
      // Initial state
      token: null,
      user: null,
      role: null,
      isLoading: false,
      error: null,

      // Actions
      setToken: (token) => set({ token }),
      setUser: (user) => set({ user }),
      setRole: (role) => set({ role }),
      setIsLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      logout: () =>
        set({
          token: null,
          user: null,
          role: null,
          error: null,
        }),
    }),
    {
      name: "lexease-auth",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
