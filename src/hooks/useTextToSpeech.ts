import { WordTiming } from "@/src/core/types";
import { resolveApiUrl } from "@/src/data/api/apiClient";
import { useAudioPlayer } from "expo-audio";
import * as Speech from "expo-speech";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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
  play: (startIndex?: number, skipSpeak?: boolean) => void;
  pause: () => void;
  stop: () => void;
}

export const useTextToSpeech = ({
  text,
  speed,
  audioUrl,
  wordTimings,
  onWordBoundary,
  onFinish,
}: UseTextToSpeechProps): UseTextToSpeechReturn => {
  const [isPlaying, setIsPlaying] = useState(false);
  const words = useMemo(() => tokenizeText(text), [text]);
  const player = useAudioPlayer(null, { updateInterval: 100 });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const finishTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef(0);
  const currentWordTimestamps = useRef<number[]>([]);
  const activeAudioUrlRef = useRef<string | null>(null);

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

  const startBackendTracking = useCallback(
    (startIndex: number): void => {
      clearTimer();

      timerRef.current = setInterval(() => {
        if (!wordTimings || wordTimings.length === 0) return;

        const positionMs = player.currentTime * 1000;
        let nextIndex = startIndex;

        for (let index = 0; index < wordTimings.length; index += 1) {
          const timing = wordTimings[index];
          const nextTiming = wordTimings[index + 1];
          const nextStart = nextTiming?.startMs ?? Number.POSITIVE_INFINITY;

          if (positionMs >= timing.startMs && positionMs < nextStart) {
            nextIndex = timing.wordIndex;
            break;
          }

          if (positionMs >= timing.startMs) {
            nextIndex = timing.wordIndex;
          }
        }

        onWordBoundaryRef.current?.(nextIndex);

        const lastTiming = wordTimings[wordTimings.length - 1];
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
    [clearTimer, player, wordTimings],
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
    clearTimer();
    Speech.stop();
    player.pause();
    player.seekTo(0).catch(() => undefined);
    setIsPlaying(false);
  }, [clearTimer, player]);

  const pause = useCallback((): void => {
    stop();
  }, [stop]);

  const play = useCallback(
    (startIndex: number = 0, skipSpeak: boolean = false): void => {
      if (!text.trim() || words.length === 0) return;

      clearTimer();
      Speech.stop();
      player.pause();

      const wordsToSpeak = words.slice(startIndex);
      if (wordsToSpeak.length === 0) {
        onFinishRef.current?.();
        return;
      }

      const resolvedAudioUrl = resolveApiUrl(audioUrl);
      if (
        resolvedAudioUrl &&
        wordTimings &&
        wordTimings.length > 0 &&
        !skipSpeak
      ) {
        const startTiming = wordTimings.find(
          (timing) => timing.wordIndex >= startIndex,
        );
        const startMs = startTiming?.startMs ?? 0;

        try {
          if (activeAudioUrlRef.current !== resolvedAudioUrl) {
            player.replace({ uri: resolvedAudioUrl });
            activeAudioUrlRef.current = resolvedAudioUrl;
          }
          player.setPlaybackRate(speed);
          player.seekTo(startMs / 1000).catch(() => undefined);
          player.play();
          setIsPlaying(true);
          startBackendTracking(startIndex);
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
      audioUrl,
      clearTimer,
      player,
      speed,
      startBackendTracking,
      startTracking,
      text,
      wordTimings,
      words,
    ],
  );

  useEffect(() => {
    return () => {
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
