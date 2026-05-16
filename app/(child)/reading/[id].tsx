import { useLocalSearchParams, useRouter } from "expo-router";
import { Volume2 } from "lucide-react-native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button, Card, ScrollView, Text, XStack, YStack } from "tamagui";

import { KaraokeTile } from "@/src/components/child/KaraokeTile";
import { ReadingControls } from "@/src/components/child/ReadingControls";
import { COLORS } from "@/src/core/constants/colors";
import { ReadingRate } from "@/src/core/types";
import { getBookById } from "@/src/data/local/books";
import { useAudioRecording } from "@/src/hooks/useAudioRecording";
import { useTextToSpeech } from "@/src/hooks/useTextToSpeech";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useConfigStore } from "@/src/store/useConfigStore";
import { useLearningStore } from "@/src/store/useLearningStore";
import { useReadingStore } from "@/src/store/useReadingStore";
import { useRecordingStore } from "@/src/store/useRecordingStore";

/**
 * Reading Screen (Full-screen)
 * Main reading experience with:
 * - Karaoke-style word highlighting synchronized with TTS audio
 * - Speed controls (Turtle/Hare)
 * - Audio recording
 * - Word-by-word highlighting via Spotlight metaphor
 * - Animations via Reanimated/Moti
 */
export default function ReadingScreen(): React.ReactElement {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const book = useMemo(() => getBookById(id), [id]);
  const { currentIndex, speed, setSpeed, setIsPlaying, setIndex, reset } =
    useReadingStore();
  const { user } = useAuthStore();
  const { addRecording } = useRecordingStore();
  const { addSession } = useLearningStore();
  const { backgroundColor } = useConfigStore();
  const { isRecording, recordingDuration, startRecording, stopRecording, playbackRecording } =
    useAudioRecording();
  const [lastRecordingUri, setLastRecordingUri] = useState<string | null>(null);
  const sessionStartRef = useRef(0);
  const sessionLoggedRef = useRef(false);
  const currentIndexRef = useRef(currentIndex);
  const speedRef = useRef(speed);

  const readingText = book?.content ?? "";
  const readingSpeed: ReadingRate = speed;

  const { isPlaying, words, play, pause } = useTextToSpeech({
    text: readingText,
    speed: readingSpeed,
    onWordBoundary: setIndex,
  });

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  const finalizeSession = useCallback((): void => {
    if (!book || sessionLoggedRef.current || !sessionStartRef.current) {
      return;
    }

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
      wordsRead: Math.max(1, currentIndexRef.current + 1),
      speed: speedRef.current,
    });
    sessionLoggedRef.current = true;
    sessionStartRef.current = 0;
  }, [addSession, book, user?.id]);

  useEffect(() => {
    // Handle hardware back button (Expo Router handles this)
  }, []);

  useEffect(() => {
    if (!book) {
      router.replace("/(child)/(tabs)/library");
    }
  }, [book, router]);

  useEffect(() => {
    return () => {
      finalizeSession();
    };
  }, [finalizeSession]);

  const handleRecordPress = async (): Promise<void> => {
    if (isRecording) {
      const uri = await stopRecording();
      if (uri && book) {
        setLastRecordingUri(uri);
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
        });
      }
      return;
    }

    await startRecording();
  };

  if (!book) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" padding="$4">
        <Text color={COLORS.textMuted}>Đang mở sách...</Text>
      </YStack>
    );
  }

  return (
    <YStack flex={1} backgroundColor={backgroundColor} padding="$4" gap="$4">
      <XStack justifyContent="space-between" alignItems="center">
        <Text fontSize="$6" fontWeight="bold" accessibilityRole="header">
          📖 {book.title}
        </Text>
        <Text
          onPress={() => router.back()}
          accessible
          accessibilityRole="button"
          accessibilitylabel="Quay lại thư viện"
          padding="$2"
        >
          ✕
        </Text>
      </XStack>

      <ScrollView
        flex={1}
        showsVerticalScrollIndicator={false}
      >
        <YStack gap="$4" paddingVertical="$4">
          <Text color={COLORS.textMuted}>
            {book.author} · {book.difficulty} · ~{book.estimatedMinutes} phút
          </Text>

          <Card padding="$4" borderWidth={1} borderColor="$color5" backgroundColor="$background">
            <YStack gap="$2">
              <Text fontSize="$4" fontWeight="700">
                Đang đọc theo nhịp
              </Text>
              <Text color={COLORS.textMuted}>
                Từ đang đọc sẽ tự bám theo nhịp giọng đọc; nếu lệch, hãy dừng và đọc lại.
              </Text>
              <Text fontSize="$7" fontWeight="700" color={COLORS.blue}>
                Từ {currentIndex + 1} / {words.length}
              </Text>
            </YStack>
          </Card>

          <XStack flexWrap="wrap" gap="$2" alignItems="center">
            {words.map((word, idx) => (
              <KaraokeTile key={`${word}-${idx}`} word={word} isHighlighted={idx === currentIndex} />
            ))}
          </XStack>
        </YStack>
      </ScrollView>

      <ReadingControls
        isPlaying={isPlaying}
        isRecording={isRecording}
        speed={speed}
        onPlay={() => {
          if (!sessionStartRef.current) {
            sessionStartRef.current = Date.now();
            sessionLoggedRef.current = false;
          }
          play();
          setIsPlaying(true);
        }}
        onPause={() => {
          pause();
          setIsPlaying(false);
        }}
        onRecord={handleRecordPress}
        onReset={() => {
          finalizeSession();
          reset();
          pause();
          setIsPlaying(false);
          setIndex(0);
        }}
        onSpeedSelect={(nextSpeed) => {
          setSpeed(nextSpeed);
        }}
      />

      {lastRecordingUri ? (
        <XStack justifyContent="center">
          <Button
            circular
            size="$6"
            backgroundColor={COLORS.orange}
            icon={<Volume2 color={COLORS.textDark} size={22} />}
            onPress={async () => {
              await playbackRecording(lastRecordingUri);
            }}
            accessible
            accessibilityRole="button"
            accessibilitylabel="Nghe bản ghi mới nhất"
          />
        </XStack>
      ) : null}
    </YStack>
  );
}
