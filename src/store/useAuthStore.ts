import { User, UserRole } from "@/src/core/types/user";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

/**
 * Auth Store
 * Manages global authentication state
 * - User role (child/guardian)
 * - Auth token
 * - User profile
 * - Persisted via middleware
 * - Hydration tracking
 */

export interface AuthStoreState {
  // State
  token: string | null;
  user: User | null;
  role: UserRole | null;
  isLoading: boolean;
  error: string | null;
  _hasHydrated: boolean;

  // Actions
  setAuth: (payload: { token: string; user: User }) => void;
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  setRole: (role: UserRole | null) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setHasHydrated: (state: boolean) => void;
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
      _hasHydrated: false,

      // Actions
      setAuth: ({ token, user }) =>
        set({
          token,
          user,
          role: user.role,
          error: null,
        }),
      setToken: (token) => set({ token }),
      setUser: (user) => set({ user, role: user?.role ?? null }),
      setRole: (role) => set({ role }),
      setIsLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      setHasHydrated: (state) => set({ _hasHydrated: state }),
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
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
