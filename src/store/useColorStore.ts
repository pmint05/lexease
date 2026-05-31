import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface ColorStoreState {
  recentColors: string[];
  addColor: (color: string) => void;
  clearHistory: () => void;
}

const MAX_RECENT_COLORS = 12;

export const useColorStore = create<ColorStoreState>()(
  persist(
    (set) => ({
      recentColors: ["#FFF8F0", "#2D3436", "#FFD93D", "#FFFFFF", "#000000"],
      addColor: (color: string) =>
        set((state) => {
          const normalizedColor = color.toUpperCase();
          const filtered = state.recentColors.filter((c) => c !== normalizedColor);
          return {
            recentColors: [normalizedColor, ...filtered].slice(0, MAX_RECENT_COLORS),
          };
        }),
      clearHistory: () => set({ recentColors: [] }),
    }),
    {
      name: "lexease-recent-colors",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
