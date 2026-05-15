import {
    RecordingPresets,
    requestRecordingPermissionsAsync,
    setAudioModeAsync,
    useAudioPlayer,
    useAudioRecorder,
    useAudioRecorderState,
} from "expo-audio";
import { useCallback, useEffect, useRef, useState } from "react";

interface UseAudioRecordingReturn {
  isRecording: boolean;
  recordingDuration: number;
  requestPermissions: () => Promise<boolean>;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<string | null>;
  playbackRecording: (uri: string) => Promise<void>;
}

export const useAudioRecording = (): UseAudioRecordingReturn => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  useAudioRecorderState(recorder); // keep state subscribed if consumer needs it
  const player = useAudioPlayer(null as any);

  const clearTimer = useCallback((): void => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const requestPermissions = useCallback(async (): Promise<boolean> => {
    const { granted } = await requestRecordingPermissionsAsync();
    return !!granted;
  }, []);

  const startRecording = useCallback(async (): Promise<void> => {
    const granted = await requestPermissions();
    if (!granted) return;

    await setAudioModeAsync({
      allowsRecording: true,
      playsInSilentMode: true,
      allowsBackgroundRecording: false,
    });

    await recorder.prepareToRecordAsync();
    recorder.record();

    setIsRecording(true);
    setRecordingDuration(0);
    clearTimer();
    timerRef.current = setInterval(() => {
      setRecordingDuration((v) => v + 1);
    }, 1000);
  }, [clearTimer, requestPermissions, recorder]);

  const stopRecording = useCallback(async (): Promise<string | null> => {
    if (!recorder) return null;

    clearTimer();
    await recorder.stop();
    const uri = (recorder as any).uri ?? null;
    setIsRecording(false);
    return uri;
  }, [clearTimer, recorder]);

  const playbackRecording = useCallback(
    async (uri: string): Promise<void> => {
      try {
        await player.replace(uri);
        player.play();
      } catch {
        // ignore
      }
    },
    [player],
  );

  useEffect(() => {
    return () => {
      clearTimer();
      recorder?.stop().catch(() => undefined);
    };
  }, [clearTimer, recorder]);

  return {
    isRecording,
    recordingDuration,
    requestPermissions,
    startRecording,
    stopRecording,
    playbackRecording,
  };
};
