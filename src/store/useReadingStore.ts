import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { ConfigFontFamily } from "../core/constants/fonts";

/**
 * Reading Store
 * Unified store for everything related to the reading experience.
 * Includes:
 * - Visual settings (Guardian-set, Persisted)
 * - User preferences (Child-set, Persisted)
 * - Active session state (Ephemeral, Not Persisted)
 */

export interface ReadingStoreState {
  // --- Visuals (Guardian/Persisted) ---
  fontSize: number;
  fontFamily: ConfigFontFamily;
  backgroundColor: string;
  textColor: string;
  letterSpacing: number;
  lineHeight: number;
  highlightColor: string;
  highlightBackgroundColor: string;
  highlightTextColor: string;

  // --- Preferences (Child/Persisted) ---
  speed: number;
  isTtsEnabled: boolean;

  // --- Session State (Transient/Not Persisted) ---
  currentIndex: number;
  isPlaying: boolean;
  isRecording: boolean;

  // --- Actions ---
  // Visual actions
  setVisuals: (config: Partial<ReadingStoreState>) => void;
  syncFromServer: (config: Partial<ReadingStoreState>) => void;

  // Preference actions
  setSpeed: (speed: number) => void;
  setIsTtsEnabled: (enabled: boolean) => void;

  // Session actions
  setIndex: (index: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setIsRecording: (recording: boolean) => void;
  resetSession: () => void;
  resetAll: () => void;
}

const DEFAULT_VISUALS = {
  fontSize: 20,
  fontFamily: "Lexend" as ConfigFontFamily,
  backgroundColor: "#FFF8F0",
  textColor: "#2D3436",
  letterSpacing: 1.2,
  lineHeight: 1.5,
  highlightColor: "#FFD93D",
  highlightBackgroundColor: "#FFD93D",
  highlightTextColor: "#2D3436",
};

const DEFAULT_PREFERENCES = {
  speed: 1.0,
  isTtsEnabled: true,
};

const INITIAL_SESSION = {
  currentIndex: 0,
  isPlaying: false,
  isRecording: false,
};

export const useReadingStore = create<ReadingStoreState>()(
  persist(
    (set) => ({
      ...DEFAULT_VISUALS,
      ...DEFAULT_PREFERENCES,
      ...INITIAL_SESSION,

      // Visuals
      setVisuals: (config) => set((state) => ({ ...state, ...config })),
      syncFromServer: (config) => set((state) => ({ ...state, ...config })),

      // Preferences
      setSpeed: (speed) => set({ speed: Math.min(Math.max(speed, 0.5), 2.0) }),
      setIsTtsEnabled: (enabled) => set({ isTtsEnabled: enabled }),

      // Session
      setIndex: (index) => set({ currentIndex: index }),
      setIsPlaying: (playing) => set({ isPlaying: playing }),
      setIsRecording: (recording) => set({ isRecording: recording }),

      resetSession: () => set(INITIAL_SESSION),

      resetAll: () =>
        set({
          ...DEFAULT_VISUALS,
          ...DEFAULT_PREFERENCES,
          ...INITIAL_SESSION,
        }),
    }),
    {
      name: "lexease-reading-v2",
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist visuals and preferences, NOT the session state
      partialize: (state) => ({
        fontSize: state.fontSize,
        fontFamily: state.fontFamily,
        backgroundColor: state.backgroundColor,
        textColor: state.textColor,
        letterSpacing: state.letterSpacing,
        lineHeight: state.lineHeight,
        highlightColor: state.highlightColor,
        highlightBackgroundColor: state.highlightBackgroundColor,
        highlightTextColor: state.highlightTextColor,
        speed: state.speed,
        isTtsEnabled: state.isTtsEnabled,
      }),
    },
  ),
);
