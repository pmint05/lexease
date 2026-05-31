import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type AnalyticsRange = "week" | "month";

interface AnalyticsState {
  range: AnalyticsRange;
  setRange: (range: AnalyticsRange) => void;
}

export const useAnalyticsStore = create<AnalyticsState>()(
  persist(
    (set) => ({
      range: "week",
      setRange: (range) => set({ range }),
    }),
    {
      name: "lexease-analytics",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
