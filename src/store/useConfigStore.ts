import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

/**
 * Config Store
 * Manages global UI customizer settings (Dyslexia-friendly)
 * - Font size
 * - Background color
 * - Letter spacing
 * - Line spacing
 * - Persisted to device via middleware (AsyncStorage)
 */

export interface ConfigStoreState {
  // State
  fontSize: number; // points (12-32)
  backgroundColor: string; // hex color
  letterSpacing: number; // multiplier (1-2.5)
  lineSpacing: number; // multiplier (1-2)

  // Actions
  setFontSize: (size: number) => void;
  setBackgroundColor: (color: string) => void;
  setLetterSpacing: (spacing: number) => void;
  setLineSpacing: (spacing: number) => void;
  reset: () => void;
}

const DEFAULT_CONFIG = {
  fontSize: 16,
  backgroundColor: "#FFF8F0", // Warm cream
  letterSpacing: 1.2,
  lineSpacing: 1.5,
};

export const useConfigStore = create<ConfigStoreState>()(
  persist(
    (set) => ({
      // Initial state
      ...DEFAULT_CONFIG,

      // Actions
      setFontSize: (size) => set({ fontSize: size }),
      setBackgroundColor: (color) => set({ backgroundColor: color }),
      setLetterSpacing: (spacing) => set({ letterSpacing: spacing }),
      setLineSpacing: (spacing) => set({ lineSpacing: spacing }),
      reset: () => set(DEFAULT_CONFIG),
    }),
    {
      name: "lexease-config",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
