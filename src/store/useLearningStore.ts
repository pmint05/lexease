import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { LearningSession } from "@/src/core/types";
import { MOCK_LEARNING_SESSIONS } from "@/src/data/local/mockLearningSessions";

interface LearningStoreState {
  sessions: LearningSession[];
  addSession: (session: LearningSession) => void;
  clearSessionsByChild: (childId: string) => void;
  clearSessions: () => void;
  ensureMockSeeded: () => void;
  getSessionsForChild: (childId: string) => LearningSession[];
  getStatsForChild: (childId: string) => {
    totalTimeMs: number;
    booksCompleted: number;
  };
  getWeeklyBucketsForChild: (
    childId: string,
    days?: number,
  ) => { x: string; y: number }[];
}

const SAMPLE_SESSIONS: LearningSession[] = MOCK_LEARNING_SESSIONS;

export const useLearningStore = create<LearningStoreState>()(
  persist(
    (set, get) => ({
      sessions: SAMPLE_SESSIONS,
      addSession: (session) =>
        set((state) => ({ sessions: [session, ...state.sessions] })),
      clearSessionsByChild: (childId) =>
        set((state) => ({
          sessions: state.sessions.filter(
            (session) => session.childId !== childId,
          ),
        })),
      clearSessions: () => set({ sessions: [] }),
      ensureMockSeeded: () => {
        const current = get().sessions;
        if (!current || current.length === 0) {
          set({ sessions: SAMPLE_SESSIONS });
          return;
        }

        const existingIds = new Set(current.map((item) => item.id));
        const missing = SAMPLE_SESSIONS.filter(
          (item) => !existingIds.has(item.id),
        );

        if (missing.length > 0) {
          set({ sessions: [...current, ...missing] });
        }
      },
      getSessionsForChild: (childId: string) => {
        const all = get().sessions ?? SAMPLE_SESSIONS;
        return all.filter((s: LearningSession) => s.childId === childId);
      },
      getStatsForChild: (childId: string) => {
        const all = get().sessions ?? SAMPLE_SESSIONS;
        const sessions = all.filter(
          (s: LearningSession) => s.childId === childId,
        );
        const totalTimeMs = sessions.reduce(
          (acc, s) => acc + (s.durationMs || 0),
          0,
        );
        const booksCompleted = new Set(sessions.map((s) => s.bookId)).size;
        return { totalTimeMs, booksCompleted };
      },
      getWeeklyBucketsForChild: (childId: string, days = 7) => {
        const all = get().sessions ?? SAMPLE_SESSIONS;
        const sessions = all.filter(
          (s: LearningSession) => s.childId === childId,
        );
        const buckets: Record<string, number> = {};
        const daysArr: { date: Date; label: string }[] = [];
        for (let i = days - 1; i >= 0; i--) {
          const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
          const label = d.toLocaleDateString(undefined, { weekday: "short" });
          daysArr.push({ date: d, label });
          buckets[label] = 0;
        }
        sessions.forEach((s) => {
          if (!s.completedAt) return;
          const key = new Date(s.completedAt).toLocaleDateString(undefined, {
            weekday: "short",
          });
          if (key in buckets) buckets[key] += 1;
        });
        return daysArr.map((d) => ({ x: d.label, y: buckets[d.label] }));
      },
    }),
    {
      name: "lexease-learning",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
