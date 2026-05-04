import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { LearningSession } from "@/src/core/types";

interface LearningStoreState {
  sessions: LearningSession[];
  addSession: (session: LearningSession) => void;
  clearSessions: () => void;
}

const sampleSessions: LearningSession[] = [
  {
    id: "session-fox-field",
    bookId: "fox-field",
    bookTitle: "The Quick Fox",
    startedAt: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
    completedAt: new Date(Date.now() - 1000 * 60 * 44).toISOString(),
    durationMs: 6 * 60 * 1000,
    wordsRead: 86,
    speed: 1.5,
  },
  {
    id: "session-blue-boat",
    bookId: "blue-boat",
    bookTitle: "Blue Water Boat",
    startedAt: new Date(Date.now() - 1000 * 60 * 130).toISOString(),
    completedAt: new Date(Date.now() - 1000 * 60 * 122).toISOString(),
    durationMs: 8 * 60 * 1000,
    wordsRead: 94,
    speed: 1.25,
  },
];

export const useLearningStore = create<LearningStoreState>()(
  persist(
    (set) => ({
      sessions: sampleSessions,
      addSession: (session) =>
        set((state) => ({ sessions: [session, ...state.sessions] })),
      clearSessions: () => set({ sessions: [] }),
    }),
    {
      name: "lexease-learning",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);