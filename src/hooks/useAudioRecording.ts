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
  meteringData: number[];
  requestPermissions: () => Promise<boolean>;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<string | null>;
  playbackRecording: (uri: string) => Promise<void>;
}

export const useAudioRecording = (): UseAudioRecordingReturn => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [meteringData, setMeteringData] = useState<number[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const meteringIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );

  const recorder = useAudioRecorder({
    ...RecordingPresets.HIGH_QUALITY,
    isMeteringEnabled: true,
  });
  const recorderState = useAudioRecorderState(recorder, 100);
  const player = useAudioPlayer(null as any);

  // Keep a ref to the latest metering value to use in the interval
  const latestMetering = useRef<number>(-160);
  const hasReceivedMetering = useRef(false);
  useEffect(() => {
    if (recorderState.metering !== undefined) {
      latestMetering.current = recorderState.metering;
      hasReceivedMetering.current = true;
    }
  }, [recorderState.metering]);

  const clearTimers = useCallback((): void => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (meteringIntervalRef.current) {
      clearInterval(meteringIntervalRef.current);
      meteringIntervalRef.current = null;
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

    // Reset data
    setMeteringData([]);
    setRecordingDuration(0);

    await recorder.prepareToRecordAsync();
    recorder.record();

    setIsRecording(true);
    clearTimers();

    // Duration timer
    timerRef.current = setInterval(() => {
      setRecordingDuration((v) => v + 1);
    }, 1000);

    // Metering timer - collect data every 100ms from the state-driven ref
    meteringIntervalRef.current = setInterval(() => {
      if (!hasReceivedMetering.current) return;
      setMeteringData((prev) => [...prev, latestMetering.current]);
    }, 100);
  }, [clearTimers, requestPermissions, recorder]);

  const stopRecording = useCallback(async (): Promise<string | null> => {
    if (!recorder) return null;

    clearTimers();
    await recorder.stop();
    const uri = (recorder as any).uri ?? null;
    setIsRecording(false);
    return uri;
  }, [clearTimers, recorder]);

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
      clearTimers();
      recorder?.stop().catch(() => undefined);
    };
  }, [clearTimers, recorder]);

  return {
    isRecording,
    recordingDuration,
    meteringData,
    requestPermissions,
    startRecording,
    stopRecording,
    playbackRecording,
  };
};
