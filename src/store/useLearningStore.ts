import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { LearningSession } from "@/src/core/types";

/**
 * Learning Store
 * Manages local cache of learning sessions.
 * Note: Most statistics should now be fetched from useProgressQueries (Backend).
 */

interface LearningStoreState {
  sessions: LearningSession[];
  addSession: (session: LearningSession) => void;
  clearSessionsByChild: (childId: string) => void;
  clearSessions: () => void;
}

export const useLearningStore = create<LearningStoreState>()(
  persist(
    (set) => ({
      sessions: [],
      addSession: (session) =>
        set((state) => {
          // Keep only the last 50 sessions locally to save space
          const newSessions = [session, ...state.sessions].slice(0, 50);
          return { sessions: newSessions };
        }),
      clearSessionsByChild: (childId) =>
        set((state) => ({
          sessions: state.sessions.filter(
            (session) => session.childId !== childId,
          ),
        })),
      clearSessions: () => set({ sessions: [] }),
    }),
    {
      name: "lexease-learning",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
