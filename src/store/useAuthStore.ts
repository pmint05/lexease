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

export type UserRole = "child" | "guardian";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface Account extends User {
  password: string;
  createdAt: string;
}

interface AuthResult {
  success: boolean;
  error?: string;
  user?: User;
}

export interface AuthStoreState {
  // State
  token: string | null;
  user: User | null;
  role: UserRole | null;
  accounts: Account[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  setRole: (role: UserRole | null) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  register: (payload: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
  }) => AuthResult;
  login: (payload: { email: string; password: string }) => AuthResult;
  logout: () => void;
}

const normalizeEmail = (value: string): string => value.trim().toLowerCase();

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const sampleAccounts: Account[] = [
  {
    id: "guardian-1",
    email: "admin@gmail.com",
    name: "Admin Guardian",
    password: "12345",
    role: "guardian",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "child-1",
    email: "child1@gmail.com",
    name: "Bé Thứ Nhất",
    password: "12345",
    role: "child",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
  {
    id: "child-2",
    email: "child2@gmail.com",
    name: "Bé Thứ Hai",
    password: "12345",
    role: "child",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  },
];

export const useAuthStore = create<AuthStoreState>()(
  persist(
    (set, get) => ({
      // Initial state
      token: null,
      user: null,
      role: null,
      accounts: sampleAccounts,
      isLoading: false,
      error: null,

      // Actions
      setToken: (token) => set({ token }),
      setUser: (user) => set({ user, role: user?.role ?? null }),
      setRole: (role) => set({ role }),
      setIsLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      register: ({ name, email, password, role }) => {
        if (!isValidEmail(email)) {
          const error = "Email không hợp lệ. Vui lòng nhập email đúng định dạng";
          set({ error });
          return { success: false, error };
        }

        const normalizedEmail = normalizeEmail(email);
        const existing = get().accounts.find(
          (account) => account.email === normalizedEmail,
        );

        if (existing) {
          const error = "Email này đã được đăng ký";
          set({ error });
          return { success: false, error };
        }

        const now = new Date().toISOString();
        const userId = `user-${Date.now()}`;
        const account: Account = {
          id: userId,
          name: name.trim(),
          email: normalizedEmail,
          password,
          role,
          createdAt: now,
        };

        const nextUser: User = {
          id: account.id,
          name: account.name,
          email: account.email,
          role: account.role,
        };

        set((state) => ({
          accounts: [...state.accounts, account],
          token: `mock-token-${Date.now()}`,
          user: nextUser,
          role: nextUser.role,
          error: null,
        }));

        return { success: true, user: nextUser };
      },
      login: ({ email, password }) => {
        const normalizedEmail = normalizeEmail(email);
        const account = get().accounts.find(
          (item) =>
            item.email === normalizedEmail && item.password === password,
        );

        if (!account) {
          const error = "Email hoặc mật khẩu không đúng";
          set({ error });
          return { success: false, error };
        }

        const nextUser: User = {
          id: account.id,
          email: account.email,
          name: account.name,
          role: account.role,
        };

        set({
          token: `mock-token-${Date.now()}`,
          user: nextUser,
          role: nextUser.role,
          error: null,
        });

        return { success: true, user: nextUser };
      },
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
