import { WordTiming } from "@/src/core/types";
import { resolveApiUrl } from "@/src/data/api/apiClient";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useAudioPlayer } from "expo-audio";
import * as Speech from "expo-speech";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Platform } from "react-native";

import {
  estimateWordTimestamps,
  tokenizeText,
} from "@/src/utils/textProcessing";

interface UseTextToSpeechProps {
  text: string;
  speed: number;
  audioUrl?: string | null;
  wordTimings?: WordTiming[];
  onWordBoundary?: (wordIndex: number) => void;
  onFinish?: () => void;
}

interface UseTextToSpeechReturn {
  isPlaying: boolean;
  words: string[];
  play: (startIndex?: number, skipSpeak?: boolean) => Promise<void>;
  pause: () => void;
  stop: () => void;
}

interface NormalizedWordTiming extends WordTiming {
  startMs: number;
  endMs: number;
}

const getTimingUnitMultiplier = (
  timings: WordTiming[],
  durationSeconds: number,
): number => {
  const lastTiming = timings[timings.length - 1];
  const lastEnd = Math.max(lastTiming?.endMs ?? 0, lastTiming?.startMs ?? 0);
  if (lastEnd <= 0) return 1;

  const durationMs = durationSeconds > 0 ? durationSeconds * 1000 : 0;
  if (durationMs > 0 && lastEnd <= durationMs / 10) return 1000;
  if (timings.length > 20 && lastEnd < 1000) return 1000;

  return 1;
};

const normalizeWordTimings = (
  timings: WordTiming[] | undefined,
  durationSeconds: number,
): NormalizedWordTiming[] => {
  if (!timings || timings.length === 0) return [];

  const multiplier = getTimingUnitMultiplier(timings, durationSeconds);
  return timings.map((timing) => ({
    ...timing,
    startMs: timing.startMs * multiplier,
    endMs: timing.endMs * multiplier,
  }));
};

export const useTextToSpeech = ({
  text,
  speed,
  audioUrl,
  wordTimings,
  onWordBoundary,
  onFinish,
}: UseTextToSpeechProps): UseTextToSpeechReturn => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackAudioUrl, setPlaybackAudioUrl] = useState<string | null>(null);
  const words = useMemo(() => tokenizeText(text), [text]);
  const resolvedAudioUrl = useMemo(() => resolveApiUrl(audioUrl), [audioUrl]);
  const player = useAudioPlayer(null, { updateInterval: 100 });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const finishTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef(0);
  const currentWordTimestamps = useRef<number[]>([]);
  const activeWordTimingsRef = useRef<NormalizedWordTiming[]>([]);
  const activeStartMsRef = useRef(0);
  const canUsePlayerPositionRef = useRef(false);
  const activeAudioUrlRef = useRef<string | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const preloadAudioRef = useRef<Promise<string | null> | null>(null);
  const sourceLoadIdRef = useRef(0);
  const playRequestIdRef = useRef(0);

  const onWordBoundaryRef = useRef(onWordBoundary);
  const onFinishRef = useRef(onFinish);

  useEffect(() => {
    onWordBoundaryRef.current = onWordBoundary;
  }, [onWordBoundary]);

  useEffect(() => {
    onFinishRef.current = onFinish;
  }, [onFinish]);

  const clearTimer = useCallback((): void => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (finishTimeoutRef.current) {
      clearTimeout(finishTimeoutRef.current);
      finishTimeoutRef.current = null;
    }
  }, []);

  const waitForPlayerLoaded = useCallback(
    async (requestId: number): Promise<void> => {
      const startedAt = Date.now();

      while (
        playRequestIdRef.current === requestId &&
        !player.isLoaded &&
        Date.now() - startedAt < 5000
      ) {
        await new Promise((resolve) => {
          setTimeout(resolve, 50);
        });
      }
    },
    [player],
  );

  const startBackendTracking = useCallback(
    (startIndex: number, startMs: number): void => {
      clearTimer();
      startTimeRef.current = Date.now();
      activeStartMsRef.current = startMs;
      canUsePlayerPositionRef.current = startMs <= 0;

      timerRef.current = setInterval(() => {
        if (activeWordTimingsRef.current.length === 0) return;

        const playerPositionMs = player.currentTime * 1000;
        if (playerPositionMs >= activeStartMsRef.current - 250) {
          canUsePlayerPositionRef.current = true;
        }

        const positionMs = canUsePlayerPositionRef.current
          ? Math.max(activeStartMsRef.current, playerPositionMs)
          : activeStartMsRef.current;
        let nextIndex = startIndex;

        for (
          let index = 0;
          index < activeWordTimingsRef.current.length;
          index += 1
        ) {
          const timing = activeWordTimingsRef.current[index];
          const nextTiming = activeWordTimingsRef.current[index + 1];
          const nextStart = nextTiming?.startMs ?? Number.POSITIVE_INFINITY;

          if (positionMs >= timing.startMs && positionMs < nextStart) {
            nextIndex = timing.wordIndex;
            break;
          }

          if (positionMs >= timing.startMs) {
            nextIndex = timing.wordIndex;
          }
        }

        onWordBoundaryRef.current?.(Math.max(startIndex, nextIndex));

        const lastTiming =
          activeWordTimingsRef.current[activeWordTimingsRef.current.length - 1];
        if (
          lastTiming &&
          positionMs >= lastTiming.endMs &&
          !finishTimeoutRef.current
        ) {
          finishTimeoutRef.current = setTimeout(() => {
            clearTimer();
            player.pause();
            setIsPlaying(false);
            onFinishRef.current?.();
          }, 300);
        }
      }, 50);
    },
    [clearTimer, player],
  );

  const startTracking = useCallback(
    (startIndex: number): void => {
      clearTimer();
      startTimeRef.current = Date.now();

      timerRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current;
        let relativeIndex = 0;

        for (
          let index = 0;
          index < currentWordTimestamps.current.length;
          index += 1
        ) {
          if (elapsed >= currentWordTimestamps.current[index]) {
            relativeIndex = index;
          } else {
            break;
          }
        }

        const absoluteIndex = startIndex + relativeIndex;
        onWordBoundaryRef.current?.(absoluteIndex);

        if (
          relativeIndex >= currentWordTimestamps.current.length - 1 &&
          !finishTimeoutRef.current
        ) {
          finishTimeoutRef.current = setTimeout(() => {
            clearTimer();
            setIsPlaying(false);
            onFinishRef.current?.();
          }, 500);
        }
      }, 50);
    },
    [clearTimer],
  );

  const stop = useCallback((): void => {
    playRequestIdRef.current += 1;
    clearTimer();
    Speech.stop();
    player.pause();
    player.seekTo(0).catch(() => undefined);
    setIsPlaying(false);
  }, [clearTimer, player]);

  const pause = useCallback((): void => {
    stop();
  }, [stop]);

  useEffect(() => {
    let isCancelled = false;
    const loadId = sourceLoadIdRef.current + 1;
    sourceLoadIdRef.current = loadId;

    playRequestIdRef.current += 1;
    clearTimer();
    Speech.stop();
    player.pause();
    activeAudioUrlRef.current = null;
    setPlaybackAudioUrl(null);
    setIsPlaying(false);

    if (!resolvedAudioUrl) {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
      return;
    }

    preloadAudioRef.current = (async () => {
      let nextAudioUrl = resolvedAudioUrl;

      if (Platform.OS === "web" && typeof fetch === "function") {
        try {
          const token = useAuthStore.getState().token;
          const response = await fetch(resolvedAudioUrl, {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          });

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }

          const blob = await response.blob();
          nextAudioUrl = URL.createObjectURL(blob);
        } catch (error) {
          console.warn(
            "Unable to preload backend TTS audio as a seekable blob; using direct URL",
            error,
          );
        }
      }

      if (isCancelled || sourceLoadIdRef.current !== loadId) {
        if (nextAudioUrl.startsWith("blob:")) {
          URL.revokeObjectURL(nextAudioUrl);
        }
        return null;
      }

      if (objectUrlRef.current && objectUrlRef.current !== nextAudioUrl) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
      if (nextAudioUrl.startsWith("blob:")) {
        objectUrlRef.current = nextAudioUrl;
      }

      player.replace({ uri: nextAudioUrl });
      activeAudioUrlRef.current = nextAudioUrl;
      setPlaybackAudioUrl(nextAudioUrl);
      return nextAudioUrl;
    })();

    return () => {
      isCancelled = true;
    };
  }, [clearTimer, player, resolvedAudioUrl]);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, []);

  const play = useCallback(
    async (
      startIndex: number = 0,
      skipSpeak: boolean = false,
    ): Promise<void> => {
      if (!text.trim() || words.length === 0) return;

      const requestId = playRequestIdRef.current + 1;
      playRequestIdRef.current = requestId;
      clearTimer();
      Speech.stop();
      player.pause();
      onWordBoundaryRef.current?.(startIndex);

      const wordsToSpeak = words.slice(startIndex);
      if (wordsToSpeak.length === 0) {
        onFinishRef.current?.();
        return;
      }

      if (
        (playbackAudioUrl || preloadAudioRef.current) &&
        wordTimings &&
        wordTimings.length > 0 &&
        !skipSpeak
      ) {
        try {
          const audioSourceUrl =
            playbackAudioUrl ?? (await preloadAudioRef.current);

          if (!audioSourceUrl) {
            throw new Error("Backend TTS audio source is not ready");
          }

          if (activeAudioUrlRef.current !== audioSourceUrl) {
            player.replace({ uri: audioSourceUrl });
            activeAudioUrlRef.current = audioSourceUrl;
          }
          await waitForPlayerLoaded(requestId);
          if (playRequestIdRef.current !== requestId) return;
          if (!player.isLoaded) {
            console.warn("Backend TTS audio is still loading; attempting playback");
          }

          const normalizedTimings = normalizeWordTimings(
            wordTimings,
            player.duration,
          );
          const startTiming = normalizedTimings.find(
            (timing) => timing.wordIndex >= startIndex,
          );
          const startMs = startTiming?.startMs;
          if (startIndex > 0 && (startMs === undefined || startMs <= 0)) {
            throw new Error(
              `No usable backend TTS timing for word index ${startIndex}`,
            );
          }

          activeWordTimingsRef.current = normalizedTimings;
          player.setPlaybackRate(speed);
          await player.seekTo((startMs ?? 0) / 1000, 0, 0);
          if (playRequestIdRef.current !== requestId) return;
          if ((startMs ?? 0) > 0) {
            await player.seekTo((startMs ?? 0) / 1000, 0, 0);
          }
          player.play();
          setIsPlaying(true);
          startBackendTracking(startIndex, startMs ?? 0);
          return;
        } catch (error) {
          console.error("Backend TTS playback error:", error);
        }
      }

      currentWordTimestamps.current = estimateWordTimestamps(
        wordsToSpeak,
        speed,
      );
      setIsPlaying(true);

      if (skipSpeak) {
        startTracking(startIndex);
      } else {
        startTracking(startIndex);
        Speech.speak(wordsToSpeak.join(" "), {
          rate: speed,
          language: "vi-VN",
          onStopped: () => {},
          onError: (error) => {
            console.error("TTS Error:", error);
          },
        });
      }
    },
    [
      clearTimer,
      playbackAudioUrl,
      player,
      speed,
      startBackendTracking,
      startTracking,
      text,
      waitForPlayerLoaded,
      wordTimings,
      words,
    ],
  );

  useEffect(() => {
    return () => {
      playRequestIdRef.current += 1;
      clearTimer();
      Speech.stop();
      player.pause();
    };
  }, [clearTimer, player]);

  return {
    isPlaying,
    words,
    play,
    pause,
    stop,
  };
};
