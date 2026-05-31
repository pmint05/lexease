import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { Recording } from "@/src/core/types";

interface RecordingStoreState {
  recordings: Recording[];
  addRecording: (recording: Recording) => void;
  replaceRecording: (recordingId: string, recording: Recording) => void;
  removeRecording: (recordingId: string) => void;
  clearRecordingsByChild: (childId: string) => void;
  clearRecordingsBySession: (sessionId: string) => void;
  clearRecordings: () => void;
}

const SAMPLE_RECORDINGS: Recording[] = [
  {
    id: "rec-child1-1",
    sessionId: "session-child1-1",
    childId: "child-1",
    bookId: "1",
    bookTitle: "Sách tiếng Anh cơ bản",
    filePath: "file:///data/child1/recording1.m4a",
    durationMs: 25 * 60 * 1000,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    sizeBytes: 15000000,
  },
  {
    id: "rec-child1-2",
    sessionId: "session-child1-2",
    childId: "child-1",
    bookId: "2",
    bookTitle: "Truyện cổ tích",
    filePath: "file:///data/child1/recording2.m4a",
    durationMs: 40 * 60 * 1000,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    sizeBytes: 22000000,
  },
  {
    id: "rec-child2-1",
    sessionId: "session-child2-1",
    childId: "child-2",
    bookId: "1",
    bookTitle: "Sách tiếng Anh cơ bản",
    filePath: "file:///data/child2/recording1.m4a",
    durationMs: 20 * 60 * 1000,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    sizeBytes: 12000000,
  },
  {
    id: "rec-child2-2",
    sessionId: "session-child2-2",
    childId: "child-2",
    bookId: "3",
    bookTitle: "Công chúa và nàng tiên cá",
    filePath: "file:///data/child2/recording2.m4a",
    durationMs: 32 * 60 * 1000,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    sizeBytes: 19000000,
  },
];

export const useRecordingStore = create<RecordingStoreState>()(
  persist(
    (set) => ({
      recordings: SAMPLE_RECORDINGS,
      addRecording: (recording) =>
        set((state) => ({ recordings: [recording, ...state.recordings] })),
      replaceRecording: (recordingId, recording) =>
        set((state) => ({
          recordings: state.recordings.map((item) =>
            item.id === recordingId
              ? { ...item, ...recording, id: recordingId }
              : item,
          ),
        })),
      removeRecording: (recordingId) =>
        set((state) => ({
          recordings: state.recordings.filter(
            (recording) => recording.id !== recordingId,
          ),
        })),
      clearRecordingsByChild: (childId) =>
        set((state) => ({
          recordings: state.recordings.filter(
            (recording) => recording.childId !== childId,
          ),
        })),
      clearRecordingsBySession: (sessionId) =>
        set((state) => ({
          recordings: state.recordings.filter(
            (recording) => recording.sessionId !== sessionId,
          ),
        })),
      clearRecordings: () => set({ recordings: [] }),
    }),
    {
      name: "lexease-recordings",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
