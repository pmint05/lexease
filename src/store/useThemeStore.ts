import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type ThemePref = "system" | "light" | "dark";

interface ThemeStoreState {
  theme: ThemePref;
  setTheme: (t: ThemePref) => void;
}

export const useThemeStore = create<ThemeStoreState>()(
  persist(
    (set) => ({
      theme: "system",
      setTheme: (t: ThemePref) => set({ theme: t }),
    }),
    {
      name: "lexease-theme",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export type { ThemePref };

