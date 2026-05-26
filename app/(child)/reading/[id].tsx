import { useFocusEffect } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BackHandler } from "react-native";
import { YStack } from "tamagui";

import { ReadingBottomBar } from "@/src/components/child/ReadingBottomBar";
import { ReadingContent } from "@/src/components/child/ReadingContent";
import { ReadingExitModal } from "@/src/components/child/ReadingExitModal";
import { ReadingHeader } from "@/src/components/child/ReadingHeader";
import { ReadingSettingsModal } from "@/src/components/child/ReadingSettingsModal";

import { getBookById } from "@/src/data/local/books";
import { useAudioRecording } from "@/src/hooks/useAudioRecording";
import { useTextToSpeech } from "@/src/hooks/useTextToSpeech";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useLearningStore } from "@/src/store/useLearningStore";
import { useReadingStore } from "@/src/store/useReadingStore";
import { useRecordingStore } from "@/src/store/useRecordingStore";

/**
 * Modern Reading Space Screen
 * Unified store integration and minimalist UI.
 */
export default function ReadingScreen(): React.ReactElement {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const book = useMemo(() => getBookById(id), [id]);

  const {
    currentIndex,
    speed,
    isPlaying,
    isTtsEnabled,
    backgroundColor,
    setIsPlaying,
    setIndex,
    setIsTtsEnabled,
    resetSession,
  } = useReadingStore();

  const { user } = useAuthStore();
  const { addRecording } = useRecordingStore();
  const { addSession } = useLearningStore();

  const {
    isRecording,
    startRecording,
    stopRecording,
    recordingDuration,
    meteringData,
  } = useAudioRecording();

  // UI State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);

  const sessionStartRef = useRef(0);
  const sessionLoggedRef = useRef(false);

  const words = useMemo(() => book?.words || [], [book]);

  // Progress calculation
  const readingProgress = useMemo(() => {
    if (!words || words.length <= 1) return 0;
    const rawProgress = (currentIndex / (words.length - 1)) * 100;
    return Math.min(Math.max(rawProgress, 0), 100);
  }, [currentIndex, words]);

  // TTS Hook
  const { play, pause, stop } = useTextToSpeech({
    text: words.join(" "),
    speed: speed,
    onWordBoundary: (newIndex) => {
      setIndex(newIndex);
    },
    onFinish: () => {
      setIsPlaying(false);
    },
  });

  const finalizeSession = useCallback((): void => {
    if (!book || sessionLoggedRef.current || !sessionStartRef.current) return;

    const startedAt = sessionStartRef.current;
    const completedAt = Date.now();
    addSession({
      id: `learn-${completedAt}`,
      childId: user?.id ?? "unknown-child",
      bookId: book.id,
      bookTitle: book.title,
      startedAt: new Date(startedAt).toISOString(),
      completedAt: new Date(completedAt).toISOString(),
      durationMs: Math.max(1000, completedAt - startedAt),
      wordsRead: currentIndex + 1,
      speed: speed,
    });
    sessionLoggedRef.current = true;
  }, [addSession, book, user?.id, currentIndex, speed]);

  // Handlers
  const handleTogglePlay = () => {
    if (isPlaying) {
      pause();
      setIsPlaying(false);
    } else {
      if (!sessionStartRef.current) {
        sessionStartRef.current = Date.now();
      }
      play(currentIndex, !isTtsEnabled);
      setIsPlaying(true);
    }
  };

  const handleRepeat = () => {
    stop();
    setIndex(0);
    setTimeout(() => {
      play(0, !isTtsEnabled);
      setIsPlaying(true);
    }, 100);
  };

  const handleWordPress = (index: number) => {
    stop();
    setIndex(index);
    if (isPlaying) {
      setTimeout(() => play(index, !isTtsEnabled), 50);
    }
  };

  const handleManualScroll = () => {
    if (isPlaying) {
      pause();
      setIsPlaying(false);
    }
  };

  const handleToggleRecording = async () => {
    if (isRecording) {
      const uri = await stopRecording();
      if (uri && book) {
        addRecording({
          id: `rec-${Date.now()}`,
          sessionId: `session-${Date.now()}`,
          childId: user?.id ?? "unknown-child",
          bookId: book.id,
          bookTitle: book.title,
          filePath: uri,
          durationMs: Math.max(1000, recordingDuration * 1000),
          createdAt: new Date().toISOString(),
          sizeBytes: 0,
          meteringData: [...meteringData],
        });
      }
    } else {
      await startRecording();
    }
  };

  const handleConfirmExit = () => {
    finalizeSession();
    resetSession();
    stop();
    router.replace("/(child)/(tabs)/library");
  };

  // Handle hardware back button
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        setIsExitModalOpen(true);
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress,
      );
      return () => backHandler.remove();
    }, []),
  );

  // Lifecycle
  useEffect(() => {
    return () => {
      stop();
    };
  }, []);

  const isFinished = useMemo(() => {
    return words.length > 0 && currentIndex >= words.length - 1;
  }, [currentIndex, words.length]);

  if (!book) return <></>;

  return (
    <YStack flex={1} backgroundColor={backgroundColor}>
      <ReadingHeader
        title={book.title}
        progress={readingProgress}
        onBack={() => setIsExitModalOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <ReadingContent
        words={words}
        currentIndex={currentIndex}
        isPlaying={isPlaying}
        onWordPress={handleWordPress}
        onManualScroll={handleManualScroll}
      />

      <ReadingBottomBar
        isPlaying={isPlaying}
        isRecording={isRecording}
        isTtsEnabled={isTtsEnabled}
        isFinished={isFinished}
        onTogglePlay={handleTogglePlay}
        onToggleTts={() => {
          if (isPlaying) {
            stop();
            setTimeout(() => play(currentIndex, isTtsEnabled), 100);
          } else if (isTtsEnabled) {
            stop();
          }
          setIsTtsEnabled(!isTtsEnabled);
        }}
        onToggleRecording={handleToggleRecording}
        onRepeat={handleRepeat}
      />

      {/* Modals */}
      <ReadingSettingsModal
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
      />

      <ReadingExitModal
        open={isExitModalOpen}
        onOpenChange={setIsExitModalOpen}
        onConfirm={handleConfirmExit}
      />
    </YStack>
  );
}
