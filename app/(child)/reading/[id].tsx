import { useFocusEffect } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BackHandler, ScrollView, View } from "react-native";

import { ReadingBottomBar } from "@/src/components/child/ReadingBottomBar";
import { ReadingContent } from "@/src/components/child/ReadingContent";
import { ReadingHeader } from "@/src/components/child/ReadingHeader";
import { ReadingSettingsModal } from "@/src/components/child/ReadingSettingsModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/components/ui/alert-dialog";
import { Skeleton } from "@/src/components/ui/skeleton";

import { Text } from "@/src/components/ui/text";
import { BackendReadingSession } from "@/src/core/types";
import { useAudioRecording } from "@/src/hooks/useAudioRecording";
import { useDisplaySettingsQuery } from "@/src/hooks/useDisplaySettingsQueries";
import {
  useCompleteReadingSessionMutation,
  useStartReadingSessionMutation,
  useUpdateReadingProgressMutation,
} from "@/src/hooks/useReadingSessionQueries";
import { useTextToSpeech } from "@/src/hooks/useTextToSpeech";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useLearningStore } from "@/src/store/useLearningStore";
import { useReadingStore } from "@/src/store/useReadingStore";
import { useRecordingStore } from "@/src/store/useRecordingStore";
import {
  buildReadingTextTokens,
  tokenizeText,
} from "@/src/utils/textProcessing";

/**
 * Modern Reading Space Screen
 * Unified store integration and minimalist UI.
 */
export default function ReadingScreen(): React.ReactElement {
  const router = useRouter();
  const { id, mode } = useLocalSearchParams<{ id: string; mode?: string }>();
  const [activeSession, setActiveSession] =
    useState<BackendReadingSession | null>(null);

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
  useDisplaySettingsQuery(user?.role === "child" ? user.id : undefined);
  const { addRecording } = useRecordingStore();
  const { addSession } = useLearningStore();
  const startSessionMutation = useStartReadingSessionMutation();
  const { mutateAsync: startReadingSession } = startSessionMutation;
  const updateProgressMutation = useUpdateReadingProgressMutation();
  const { mutate: updateReadingProgress } = updateProgressMutation;
  const completeSessionMutation = useCompleteReadingSessionMutation();

  const {
    isRecording,
    startRecording,
    stopRecording,
    recordingDuration,
    meteringData,
  } = useAudioRecording();

  // UI State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isExitAlertOpen, setIsExitAlertOpen] = useState(false);

  const sessionStartRef = useRef(0);
  const sessionLoggedRef = useRef(false);
  const lastProgressSyncRef = useRef(0);
  const completedBackendRef = useRef(false);
  const startReadingSessionRef = useRef(startReadingSession);
  const updateReadingProgressRef = useRef(updateReadingProgress);
  const resetSessionRef = useRef(resetSession);
  const stopRef = useRef<() => void>(() => undefined);
  const setIndexRef = useRef(setIndex);

  const shouldStartFromBeginning = mode === "start";

  const book = useMemo(() => {
    if (!activeSession) return null;
    const words = tokenizeText(activeSession.story.content);
    const tokens = buildReadingTextTokens(activeSession.story.content);
    return {
      id: activeSession.story.id,
      title: activeSession.story.title,
      content: activeSession.story.content,
      words,
      tokens,
    };
  }, [activeSession]);

  const words = useMemo(() => book?.words || [], [book]);
  const tokens = useMemo(() => book?.tokens || [], [book]);

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
    audioUrl:
      activeSession?.tts.status === "READY" ? activeSession.tts.audioUrl : null,
    wordTimings:
      activeSession?.tts.status === "READY"
        ? activeSession.tts.wordTimings
        : [],
    onWordBoundary: (newIndex) => {
      setIndex(newIndex);
    },
    onFinish: () => {
      setIsPlaying(false);
    },
  });

  useEffect(() => {
    startReadingSessionRef.current = startReadingSession;
  }, [startReadingSession]);

  useEffect(() => {
    updateReadingProgressRef.current = updateReadingProgress;
  }, [updateReadingProgress]);

  useEffect(() => {
    resetSessionRef.current = resetSession;
  }, [resetSession]);

  useEffect(() => {
    stopRef.current = stop;
  }, [stop]);

  useEffect(() => {
    setIndexRef.current = setIndex;
  }, [setIndex]);

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

  const syncProgress = useCallback(
    (force = false): void => {
      if (!activeSession || activeSession.status !== "IN_PROGRESS") return;

      const now = Date.now();
      if (!force && now - lastProgressSyncRef.current < 1500) return;

      lastProgressSyncRef.current = now;
      updateReadingProgress({
        sessionId: activeSession.sessionId,
        request: {
          currentWordIndex: Math.max(0, currentIndex),
          elapsedMs: sessionStartRef.current
            ? Math.max(0, now - sessionStartRef.current)
            : activeSession.elapsedMs,
          events: [
            {
              type: "WORD_SHOWN",
              word: words[currentIndex],
              wordIndex: currentIndex,
              timestampMs: sessionStartRef.current
                ? Math.max(0, now - sessionStartRef.current)
                : activeSession.elapsedMs,
            },
          ],
        },
      });
    },
    [activeSession, currentIndex, updateReadingProgress, words],
  );

  // Handlers
  const handleTogglePlay = () => {
    if (isPlaying) {
      pause();
      setIsPlaying(false);
    } else {
      if (!sessionStartRef.current) {
        sessionStartRef.current = Date.now();
      }
      void play(currentIndex, !isTtsEnabled);
      setIsPlaying(true);
    }
  };

  const handleRepeat = async () => {
    stop();
    setIndex(0);
    completedBackendRef.current = false;
    sessionLoggedRef.current = false;
    lastProgressSyncRef.current = 0;
    sessionStartRef.current = Date.now();

    if (id) {
      try {
        const session = await startReadingSession({
          storyId: id,
          voice: "Binh",
          mode: "START_FROM_BEGINNING",
        });
        setActiveSession(session);
        setIndex(0);
        sessionStartRef.current = Date.now();
      } catch (error) {
        console.error("Unable to restart reading session:", error);
      }
    }

    void play(0, !isTtsEnabled);
    setIsPlaying(true);
  };

  const handleWordPress = (index: number) => {
    stop();
    setIndex(index);
    if (isPlaying) {
      setTimeout(() => {
        void play(index, !isTtsEnabled);
      }, 50);
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

  const handleConfirmExit = useCallback(() => {
    setIsExitAlertOpen(false);
    syncProgress(true);
    finalizeSession();
    resetSession();
    stop();
    router.replace("/(child)/(tabs)/library");
  }, [finalizeSession, resetSession, stop, router, syncProgress]);

  const triggerExitAlert = useCallback(() => {
    setIsExitAlertOpen(true);
  }, []);

  // Handle hardware back button
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        triggerExitAlert();
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress,
      );
      return () => backHandler.remove();
    }, [triggerExitAlert]),
  );

  // Lifecycle
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  useEffect(() => {
    if (!id) return;
    let isCancelled = false;

    stopRef.current();
    resetSessionRef.current();
    completedBackendRef.current = false;
    sessionLoggedRef.current = false;
    lastProgressSyncRef.current = 0;
    sessionStartRef.current = 0;

    startReadingSessionRef
      .current({
        storyId: id,
        voice: "Binh",
        mode: shouldStartFromBeginning
          ? "START_FROM_BEGINNING"
          : "RESUME_OR_START",
      })
      .then((session) => {
        if (isCancelled) return;
        const resumeIndex = shouldStartFromBeginning
          ? 0
          : session.resumePosition.wordIndex;

        setActiveSession(session);
        setIndexRef.current(resumeIndex);
        sessionStartRef.current = shouldStartFromBeginning
          ? 0
          : Date.now() - session.elapsedMs;

        if (shouldStartFromBeginning && session.status === "IN_PROGRESS") {
          updateReadingProgressRef.current({
            sessionId: session.sessionId,
            request: {
              currentWordIndex: 0,
              elapsedMs: 0,
              events: [
                {
                  type: "START",
                  wordIndex: 0,
                  timestampMs: 0,
                  metadata: { mode: "START_FROM_BEGINNING" },
                },
              ],
            },
          });
        }
      })
      .catch((error) => {
        console.error("Unable to start reading session:", error);
      });

    return () => {
      isCancelled = true;
    };
  }, [id, shouldStartFromBeginning]);

  useEffect(() => {
    if (!activeSession || currentIndex <= 0) return;
    syncProgress(false);
  }, [activeSession, currentIndex, syncProgress]);

  const isFinished = useMemo(() => {
    return words.length > 0 && currentIndex >= words.length - 1;
  }, [currentIndex, words.length]);

  useEffect(() => {
    if (!activeSession || !isFinished || completedBackendRef.current) return;

    completedBackendRef.current = true;
    syncProgress(true);
    completeSessionMutation.mutate(activeSession.sessionId);
    finalizeSession();
  }, [
    activeSession,
    completeSessionMutation,
    finalizeSession,
    isFinished,
    syncProgress,
  ]);

  if (!book) {
    return (
      <View className="flex-1 bg-background">
        <ReadingHeader
          title="Đang tải bài đọc"
          progress={0}
          onBack={() => router.replace("/(child)/(tabs)/library")}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
          className="pt-4"
        >
          <View className="px-4">
            <Skeleton className="h-6 w-2/3 rounded-full mb-4" />
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full rounded-full mb-3" />
            ))}
          </View>
        </ScrollView>

        <View className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-background border-t border-border">
          <Skeleton className="h-11 w-full rounded-xl" />
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }} className="bg-background">
      <ReadingHeader
        title={book.title}
        progress={readingProgress}
        onBack={triggerExitAlert}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <ReadingContent
        tokens={tokens}
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
            setTimeout(() => {
              void play(currentIndex, isTtsEnabled);
            }, 100);
          } else if (isTtsEnabled) {
            stop();
          }
          setIsTtsEnabled(!isTtsEnabled);
        }}
        onToggleRecording={handleToggleRecording}
        onRepeat={handleRepeat}
      />

      <AlertDialog open={isExitAlertOpen} onOpenChange={setIsExitAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Thoát bài đọc?</AlertDialogTitle>
            <AlertDialogDescription>
              Tiến độ đọc và bản ghi âm của bé sẽ bị mất nếu thoát bây giờ. Bé
              có chắc chắn muốn quay lại thư viện không?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel className="flex-1">
              <Text className="text-base font-semibold text-foreground text-center">
                Quay lại đọc tiếp
              </Text>
            </AlertDialogCancel>
            <AlertDialogAction
              className="flex-1 bg-destructive text-foreground active:bg-destructive/90"
              onPress={handleConfirmExit}
            >
              <Text className="text-base font-semibold text-foreground text-center">
                Thoát ra
              </Text>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modals */}
      {isSettingsOpen && (
        <ReadingSettingsModal
          open={isSettingsOpen}
          onOpenChange={setIsSettingsOpen}
        />
      )}
    </View>
  );
}
