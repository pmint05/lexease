import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { Recording } from "@/src/core/types";

interface RecordingStoreState {
  recordings: Recording[];
  addRecording: (recording: Recording) => void;
  removeRecording: (recordingId: string) => void;
  clearRecordings: () => void;
}

export const useRecordingStore = create<RecordingStoreState>()(
  persist(
    (set) => ({
      recordings: [],
      addRecording: (recording) =>
        set((state) => ({ recordings: [recording, ...state.recordings] })),
      removeRecording: (recordingId) =>
        set((state) => ({
          recordings: state.recordings.filter(
            (recording) => recording.id !== recordingId,
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