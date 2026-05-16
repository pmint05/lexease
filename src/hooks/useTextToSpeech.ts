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
  words: string[];
  play: (startIndex?: number, skipSpeak?: boolean) => void;
  pause: () => void;
  stop: () => void;
}

export const useTextToSpeech = ({
  text,
  speed,
  onWordBoundary,
  onFinish,
}: UseTextToSpeechProps): UseTextToSpeechReturn => {
  const [isPlaying, setIsPlaying] = useState(false);
  const words = useMemo(() => tokenizeText(text), [text]);
  
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const finishTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef(0);
  const currentWordTimestamps = useRef<number[]>([]);
  
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

  const startTracking = useCallback((startIndex: number): void => {
    clearTimer();
    startTimeRef.current = Date.now();

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      let relativeIndex = 0;

      for (let index = 0; index < currentWordTimestamps.current.length; index += 1) {
        if (elapsed >= currentWordTimestamps.current[index]) {
          relativeIndex = index;
        } else {
          break;
        }
      }

      const absoluteIndex = startIndex + relativeIndex;
      onWordBoundaryRef.current?.(absoluteIndex);

      // Check for completion - ONLY trigger if not already finishing
      if (relativeIndex >= currentWordTimestamps.current.length - 1 && !finishTimeoutRef.current) {
        finishTimeoutRef.current = setTimeout(() => {
          clearTimer();
          setIsPlaying(false);
          onFinishRef.current?.();
        }, 500);
      }
    }, 50);
  }, [clearTimer]);

  const stop = useCallback((): void => {
    clearTimer();
    Speech.stop();
    setIsPlaying(false);
  }, [clearTimer]);

  const pause = useCallback((): void => {
    stop();
  }, [stop]);

  const play = useCallback((startIndex: number = 0, skipSpeak: boolean = false): void => {
    if (!text.trim() || words.length === 0) return;

    clearTimer();
    Speech.stop();
    
    const wordsToSpeak = words.slice(startIndex);
    if (wordsToSpeak.length === 0) {
      onFinishRef.current?.();
      return;
    }

    currentWordTimestamps.current = estimateWordTimestamps(wordsToSpeak, SPEED_MAP[speed]);
    setIsPlaying(true);

    if (skipSpeak) {
      startTracking(startIndex);
    } else {
      startTracking(startIndex);
      Speech.speak(wordsToSpeak.join(" "), {
        rate: SPEED_MAP[speed],
        language: "vi-VN",
        onStopped: () => {
          // If system stops TTS, visuals can continue unless clearTimer was called
        },
        onError: (error) => {
          console.error("TTS Error:", error);
        },
      });
    }
  }, [clearTimer, speed, startTracking, text, words]);

  useEffect(() => {
    return () => {
      clearTimer();
      Speech.stop();
    };
  }, [clearTimer]);

  return {
    isPlaying,
    words,
    play,
    pause,
    stop,
  };
};
