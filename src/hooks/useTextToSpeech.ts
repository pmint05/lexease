import * as Speech from "expo-speech";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { ReadingRate } from "@/src/core/types";
import { estimateWordTimestamps, tokenizeText } from "@/src/utils/textProcessing";

const SPEED_MAP: Record<ReadingRate, number> = {
  0.5: 0.5,
  0.75: 0.75,
  1: 1,
  1.25: 1.25,
  1.5: 1.5,
};

interface UseTextToSpeechProps {
  text: string;
  speed: ReadingRate;
  onWordBoundary?: (wordIndex: number) => void;
  onFinish?: () => void;
}

interface UseTextToSpeechReturn {
  isPlaying: boolean;
  currentSpeed: ReadingRate;
  words: string[];
  wordTimestamps: number[];
  play: () => void;
  pause: () => void;
  stop: () => void;
  toggleSpeed: () => void;
}

export const useTextToSpeech = ({
  text,
  speed,
  onWordBoundary,
  onFinish,
}: UseTextToSpeechProps): UseTextToSpeechReturn => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSpeed, setCurrentSpeed] = useState<ReadingRate>(speed);
  const words = useMemo(() => tokenizeText(text), [text]);
  const wordTimestamps = useMemo(
    () => estimateWordTimestamps(words, SPEED_MAP[currentSpeed]),
    [currentSpeed, words],
  );
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(0);

  const clearTimer = useCallback((): void => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTracking = useCallback((): void => {
    clearTimer();
    startTimeRef.current = Date.now();

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      let nextIndex = 0;

      for (let index = 0; index < wordTimestamps.length; index += 1) {
        if (elapsed >= wordTimestamps[index]) {
          nextIndex = index;
        } else {
          break;
        }
      }

      onWordBoundary?.(nextIndex);
    }, 80);
  }, [clearTimer, onWordBoundary, wordTimestamps]);

  const stop = useCallback((): void => {
    clearTimer();
    Speech.stop();
    setIsPlaying(false);
  }, [clearTimer]);

  const pause = useCallback((): void => {
    stop();
  }, [stop]);

  const play = useCallback((): void => {
    if (!text.trim()) {
      return;
    }

    clearTimer();
    Speech.stop();
    setIsPlaying(false);
    onWordBoundary?.(0);

    Speech.speak(text, {
      rate: SPEED_MAP[currentSpeed],
      language: "en-US",
      onStart: () => {
        setIsPlaying(true);
        startTracking();
      },
      onDone: () => {
        clearTimer();
        setIsPlaying(false);
        onWordBoundary?.(Math.max(0, words.length - 1));
        onFinish?.();
      },
      onStopped: () => {
        clearTimer();
        setIsPlaying(false);
      },
      onError: () => {
        clearTimer();
        setIsPlaying(false);
      },
    });
  }, [clearTimer, currentSpeed, onFinish, onWordBoundary, startTracking, text, words.length]);

  const toggleSpeed = useCallback((): void => {
    const speedOptions: ReadingRate[] = [0.5, 0.75, 1, 1.25, 1.5];
    const currentIndex = speedOptions.indexOf(currentSpeed);
    setCurrentSpeed(speedOptions[(currentIndex + 1) % speedOptions.length]);
  }, [currentSpeed]);

  useEffect(() => {
    setCurrentSpeed(speed);
  }, [speed]);

  useEffect(() => {
    return () => {
      clearTimer();
      Speech.stop();
    };
  }, [clearTimer]);

  return {
    isPlaying,
    currentSpeed,
    words,
    wordTimestamps,
    play,
    pause,
    stop,
    toggleSpeed,
  };
};