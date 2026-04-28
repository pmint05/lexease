import { useReadingStore } from "@/src/store/useReadingStore";
import { useEffect, useRef } from "react";
import { runOnJS, SharedValue, useSharedValue } from "react-native-reanimated";

/**
 * useAudioSync Hook
 *
 * Synchronizes text-to-speech audio playback with visual highlighting (Karaoke Spotlight)
 *
 * ALGORITHM:
 * 1. Load word timestamps array from TTS metadata (e.g., [0ms, 1200ms, 2400ms, ...])
 * 2. Subscribe to audio position updates from Expo.AV Sound.onPlaybackStatusUpdate()
 * 3. For each position update:
 *    - Find the word index where audioPos >= wordTimestamps[index]
 *    - Update Zustand store with currentIndex (triggers UI re-render)
 *    - Update Reanimated shared value for smooth animations
 * 4. Handle speed changes by adjusting playback rate or recalculating timestamps
 * 5. Handle pause/resume by clearing animations
 *
 * REANIMATED INTEGRATION:
 * - audioPosition: Shared value tracking current audio position (ms)
 * - highlightProgress: Shared value for animation progress (0-1) between words
 * - Uses runOnJS() to bridge Reanimated thread and React state updates
 *
 * COMPONENT INTEGRATION EXAMPLE:
 * ```
 * const { audioPosition, highlightProgress, currentIndex } = useAudioSync({
 *   wordTimestamps: [0, 1000, 2000, 3000],
 *   isPlaying: true,
 *   speed: 'hare',
 * });
 *
 * // Use currentIndex for conditional rendering
 * // Use Reanimated shared values for smooth animations
 * // Call onAudioPositionUpdate(position) from Sound.onPlaybackStatusUpdate()
 * ```
 *
 * TODO (Phase 2):
 * - [ ] Implement actual TTS timestamp generation
 * - [ ] Add Reanimated animation configuration\n * - [ ] Handle speed changes (pause/adjust rate/resume)\n * - [ ] Add error handling for misaligned audio
 * - [ ] Optimize for large texts (virtualizing word list)
 * - [ ] Add analytics for sync accuracy (drift monitoring)
 */

export interface UseAudioSyncProps {
  wordTimestamps: number[]; // Word start times in milliseconds
  isPlaying: boolean;
  speed: "turtle" | "hare";
}

export interface UseAudioSyncReturn {
  currentIndex: number;
  audioPosition: SharedValue<number>;
  nextWordTimestamp: number;
  highlightProgress: SharedValue<number>;
  handleAudioPositionUpdate: (position: number) => void;
}

/**
 * Custom hook for audio-text synchronization
 * Returns Reanimated shared values for animations and current index from Zustand
 */
export const useAudioSync = ({
  wordTimestamps,
  isPlaying,
  speed,
}: UseAudioSyncProps): UseAudioSyncReturn => {
  // Reanimated shared values for smooth animations
  const audioPosition = useSharedValue<number>(0);
  const highlightProgress = useSharedValue<number>(0);

  // Zustand store for UI state updates
  const { currentIndex, setIndex } = useReadingStore();

  // Store word timestamps to avoid stale closure
  const wordTimestampsRef = useRef(wordTimestamps);
  useEffect(() => {
    wordTimestampsRef.current = wordTimestamps;
  }, [wordTimestamps]);

  /**
   * Called whenever audio position updates (from Sound.onPlaybackStatusUpdate)
   * Finds current word index and updates both Zustand store and Reanimated shared values
   */
  const handleAudioPositionUpdate = (position: number): void => {
    // Update shared value for Reanimated animations
    audioPosition.value = position;

    // Find current word index based on audio position
    const timestamps = wordTimestampsRef.current;
    let newIndex = 0;

    for (let i = 0; i < timestamps.length; i++) {
      if (position >= timestamps[i]) {
        newIndex = i;
      } else {
        break;
      }
    }

    // Update Zustand store (triggers UI re-render)
    if (newIndex !== currentIndex) {
      runOnJS(setIndex)(newIndex);
    }

    // Calculate highlight progress (0-1) for animation interpolation
    const currentTimestamp = timestamps[newIndex];
    const nextTimestamp = timestamps[newIndex + 1];

    if (nextTimestamp !== undefined) {
      const progress =
        (position - currentTimestamp) / (nextTimestamp - currentTimestamp);
      highlightProgress.value = Math.min(1, Math.max(0, progress));
    } else {
      highlightProgress.value = 1; // Last word
    }
  };

  // Reset when playback stops
  useEffect(() => {
    if (!isPlaying) {
      highlightProgress.value = 0;
    }
  }, [isPlaying, highlightProgress]);

  // Handle speed changes (TODO: Implement playback rate adjustment)
  useEffect(() => {
    // When speed changes, TTS playback rate updates automatically
    // However, if word timestamps are pre-computed, they may need recalculation
    // For now, we assume TTS handles speed internally
  }, [speed]);

  return {
    currentIndex,
    audioPosition,
    nextWordTimestamp: wordTimestamps[currentIndex + 1] ?? 0,
    highlightProgress,
    handleAudioPositionUpdate,
  };
};
