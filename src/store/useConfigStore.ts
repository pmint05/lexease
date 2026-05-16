import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { ReadingConfig } from "../core/types/config";

/**
 * Config Store
 * Manages global UI customizer settings (Dyslexia-friendly)
 * - Persisted to device via middleware (AsyncStorage)
 * - Can be synced from server (Guardian settings)
 */

export interface ConfigStoreState extends ReadingConfig {
  // Actions
  setConfig: (config: Partial<ReadingConfig>) => void;
  syncFromServer: (serverConfig: ReadingConfig) => void;
  reset: () => void;
}

const DEFAULT_CONFIG: ReadingConfig = {
  fontSize: 20,
  backgroundColor: "#FFF8F0", // Warm cream
  textColor: "#2D3436",
  letterSpacing: 1.2,
  lineHeight: 1.5,
  fontFamily: "Lexend",
  highlightColor: "#FFD93D", // Bright yellow
  wordsPerHighlight: 1,
};

export const useConfigStore = create<ConfigStoreState>()(
  persist(
    (set) => ({
      // Initial state
      ...DEFAULT_CONFIG,

      // Actions
      setConfig: (config) => set((state) => ({ ...state, ...config })),
      
      syncFromServer: (serverConfig) => set((state) => ({ 
        ...state, 
        ...serverConfig 
      })),

      reset: () => set(DEFAULT_CONFIG),
    }),
    {
      name: "lexease-config",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
