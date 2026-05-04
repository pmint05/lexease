import { Audio } from "expo-av";
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
  const recordingRef = useRef<Audio.Recording | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback((): void => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const requestPermissions = useCallback(async (): Promise<boolean> => {
    const { status } = await Audio.requestPermissionsAsync();
    return status === "granted";
  }, []);

  const startRecording = useCallback(async (): Promise<void> => {
    const granted = await requestPermissions();
    if (!granted) {
      return;
    }

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
    });

    const recording = new Audio.Recording();
    await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
    await recording.startAsync();

    recordingRef.current = recording;
    setIsRecording(true);
    setRecordingDuration(0);
    clearTimer();
    timerRef.current = setInterval(() => {
      setRecordingDuration((value) => value + 1);
    }, 1000);
  }, [clearTimer, requestPermissions]);

  const stopRecording = useCallback(async (): Promise<string | null> => {
    if (!recordingRef.current) {
      return null;
    }

    clearTimer();
    await recordingRef.current.stopAndUnloadAsync();
    const uri = recordingRef.current.getURI();
    recordingRef.current = null;
    setIsRecording(false);
    return uri;
  }, [clearTimer]);

  const playbackRecording = useCallback(async (uri: string): Promise<void> => {
    const { sound } = await Audio.Sound.createAsync({ uri });
    await sound.playAsync();
  }, []);

  useEffect(() => {
    return () => {
      clearTimer();
      recordingRef.current?.stopAndUnloadAsync().catch(() => undefined);
    };
  }, [clearTimer]);

  return {
    isRecording,
    recordingDuration,
    requestPermissions,
    startRecording,
    stopRecording,
    playbackRecording,
  };
};