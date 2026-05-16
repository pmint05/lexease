import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { Button, Card, ScrollView, Text, XStack, YStack } from "tamagui";

import { RecordingTile } from "@/src/components/child/RecordingTile";
import { COLORS } from "@/src/core/constants/colors";
import { getBookById } from "@/src/data/local/books";
import { useAudioRecording } from "@/src/hooks/useAudioRecording";
import { useLearningStore } from "@/src/store/useLearningStore";
import { useRecordingStore } from "@/src/store/useRecordingStore";

export default function BookDetailScreen(): React.ReactElement {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const book = useMemo(() => getBookById(id), [id]);
  const { sessions } = useLearningStore();
  const { recordings, removeRecording } = useRecordingStore();
  const { playbackRecording } = useAudioRecording();

  const bookSessions = useMemo(() => sessions.filter((session) => session.bookId === id), [id, sessions]);
  const bookRecordings = useMemo(() => recordings.filter((recording) => recording.bookId === id), [id, recordings]);

  if (!book) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" padding="$4">
        <Text color={COLORS.textMuted}>Không tìm thấy sách</Text>
      </YStack>
    );
  }

  return (
    <YStack flex={1} backgroundColor={COLORS.cream} padding="$4" gap="$4">
      <XStack justifyContent="space-between" alignItems="center">
        <Text fontSize="$6" fontWeight="700">
          Chi tiết sách
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

      <Card padding="$4" borderWidth={1} borderColor="$color5" backgroundColor="$background">
        <YStack gap="$2">
          <Text fontSize="$6" fontWeight="700">
            {book.title}
          </Text>
          <Text color="$color10">Tác giả: {book.author}</Text>
          <Text color="$color10">Độ khó: {book.difficulty}</Text>
          <Text color="$color10">~{book.estimatedMinutes} phút · {book.wordCount} từ</Text>

          <Button
            size="$5"
            onPress={() => router.push({ pathname: "/(child)/reading/[id]", params: { id: book.id } })}
            backgroundColor={COLORS.green}
            accessibilityRole="button"
            accessibilitylabel={`Bắt đầu đọc ${book.title}`}
          >
            Đọc ngay
          </Button>
        </YStack>
      </Card>

      <ScrollView showsVerticalScrollIndicator={false}>
        <YStack gap="$4">
          <Card padding="$4" borderWidth={1} borderColor="$color5">
            <YStack gap="$3">
              <Text fontSize="$5" fontWeight="700">Con đã học gì</Text>
              {bookSessions.length > 0 ? (
                bookSessions.map((session) => (
                  <YStack key={session.id} paddingVertical="$2" borderBottomWidth={1} borderBottomColor="$color4">
                    <Text fontWeight="700">{session.bookTitle}</Text>
                    <Text color="$color10">
                      {Math.round(session.durationMs / 60000)} phút · {session.wordsRead} từ · {session.speed}x
                    </Text>
                    <Text color="$color10">Bắt đầu: {new Date(session.startedAt).toLocaleString("vi-VN")}</Text>
                  </YStack>
                ))
              ) : (
                <Text color="$color10">Chưa có phiên học nào cho sách này.</Text>
              )}
            </YStack>
          </Card>

          <Card padding="$4" borderWidth={1} borderColor="$color5">
            <YStack gap="$3">
              <Text fontSize="$5" fontWeight="700">File ghi âm của con</Text>
              {bookRecordings.length > 0 ? (
                bookRecordings.map((recording) => (
                  <RecordingTile
                    key={recording.id}
                    recording={recording}
                    onPlay={async (item) => {
                      await playbackRecording(item.filePath);
                    }}
                    onDelete={removeRecording}
                  />
                ))
              ) : (
                <Text color="$color10">Chưa có bản ghi nào cho sách này.</Text>
              )}
            </YStack>
          </Card>
        </YStack>
      </ScrollView>
    </YStack>
  );
}