import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { LearningSession } from "@/src/core/types";

interface LearningStoreState {
  sessions: LearningSession[];
  addSession: (session: LearningSession) => void;
  clearSessionsByChild: (childId: string) => void;
  clearSessions: () => void;
}

const SAMPLE_SESSIONS: LearningSession[] = [
  {
    id: "session-child1-1",
    childId: "child-1",
    bookId: "1",
    bookTitle: "Sách tiếng Anh cơ bản",
    startedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
    durationMs: 30 * 60 * 1000,
    wordsRead: 250,
    speed: 1.0,
  },
  {
    id: "session-child1-2",
    childId: "child-1",
    bookId: "2",
    bookTitle: "Truyện cổ tích",
    startedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000).toISOString(),
    durationMs: 45 * 60 * 1000,
    wordsRead: 380,
    speed: 1.2,
  },
  {
    id: "session-child2-1",
    childId: "child-2",
    bookId: "1",
    bookTitle: "Sách tiếng Anh cơ bản",
    startedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 25 * 60 * 1000).toISOString(),
    durationMs: 25 * 60 * 1000,
    wordsRead: 180,
    speed: 0.9,
  },
  {
    id: "session-child2-2",
    childId: "child-2",
    bookId: "3",
    bookTitle: "Công chúa và nàng tiên cá",
    startedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 35 * 60 * 1000).toISOString(),
    durationMs: 35 * 60 * 1000,
    wordsRead: 290,
    speed: 1.1,
  },
];

export const useLearningStore = create<LearningStoreState>()(
  persist(
    (set) => ({
      sessions: SAMPLE_SESSIONS,
      addSession: (session) =>
        set((state) => ({ sessions: [session, ...state.sessions] })),
      clearSessionsByChild: (childId) =>
        set((state) => ({
          sessions: state.sessions.filter((session) => session.childId !== childId),
        })),
      clearSessions: () => set({ sessions: [] }),
    }),
    {
      name: "lexease-learning",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);