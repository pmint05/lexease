import { create } from "zustand";

/**
 * Reading Store
 * Manages global reading session state
 * - Current word/phrase index (for Karaoke highlighting)
 * - Playback speed (Turtle/Hare)
 * - Playback state (playing/paused)
 * - Audio position
 * Non-persisted (ephemeral, session-only state)
 */

export type Speed = "turtle" | "hare";

export interface AudioState {
  position: number; // milliseconds
  duration: number; // milliseconds
}

export interface ReadingStoreState {
  // State
  currentIndex: number; // Current word index for highlighting
  speed: Speed; // Playback speed
  isPlaying: boolean; // Playback state
  audioState: AudioState; // Audio position and duration

  // Actions
  setIndex: (index: number) => void;
  setSpeed: (speed: Speed) => void;
  setIsPlaying: (playing: boolean) => void;
  setAudioState: (state: Partial<AudioState>) => void;
  reset: () => void;
}

const initialAudioState: AudioState = {
  position: 0,
  duration: 0,
};

export const useReadingStore = create<ReadingStoreState>((set) => ({
  // Initial state
  currentIndex: 0,
  speed: "hare",
  isPlaying: false,
  audioState: initialAudioState,

  // Actions
  setIndex: (index) => set({ currentIndex: index }),
  setSpeed: (speed) => set({ speed }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setAudioState: (state) =>
    set((prev) => ({
      audioState: {
        ...prev.audioState,
        ...state,
      },
    })),
  reset: () =>
    set({
      currentIndex: 0,
      speed: "hare",
      isPlaying: false,
      audioState: initialAudioState,
    }),
}));
