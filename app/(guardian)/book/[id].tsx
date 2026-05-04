import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { Button, Card, ScrollView, Text, XStack, YStack } from "tamagui";

import { RecordingTile } from "@/src/components/child/RecordingTile";
import { COLORS } from "@/src/core/constants/colors";
import { getBookById } from "@/src/data/local/books";
import { useAudioRecording } from "@/src/hooks/useAudioRecording";
import { useLearningStore } from "@/src/store/useLearningStore";
import { useRecordingStore } from "@/src/store/useRecordingStore";

export default function GuardianBookDetailScreen(): React.ReactElement {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { sessions } = useLearningStore();
  const { recordings, removeRecording } = useRecordingStore();
  const { playbackRecording } = useAudioRecording();

  const book = useMemo(() => getBookById(id), [id]);
  const bookSessions = useMemo(() => sessions.filter((session) => session.bookId === id), [id, sessions]);
  const bookRecordings = useMemo(() => recordings.filter((recording) => recording.bookId === id), [id, recordings]);

  if (!book) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" padding="$4">
        <Text color={COLORS.textMuted}>Không tìm thấy sách.</Text>
      </YStack>
    );
  }

  return (
    <YStack flex={1} backgroundColor={COLORS.cream} padding="$4" gap="$4">
      <XStack justifyContent="space-between" alignItems="center">
        <Text fontSize="$6" fontWeight="700">Chi tiết sách của bé</Text>
        <Button size="$3" onPress={() => router.back()} accessibilityLabel="Quay lại Guardian dashboard">
          Quay lại
        </Button>
      </XStack>

      <Card padding="$4" borderWidth={1} borderColor="$color5">
        <YStack gap="$2">
          <Text fontSize="$6" fontWeight="700">{book.title}</Text>
          <Text color="$color10">{book.author}</Text>
          <Text color="$color10">{bookSessions.length} lần học · {bookRecordings.length} bản ghi</Text>
        </YStack>
      </Card>

      <ScrollView showsVerticalScrollIndicator={false}>
        <YStack gap="$4">
          <Card padding="$4" borderWidth={1} borderColor="$color5">
            <YStack gap="$3">
              <Text fontSize="$5" fontWeight="700">Các lần đọc</Text>
              {bookSessions.length > 0 ? (
                bookSessions.map((session) => (
                  <YStack key={session.id} paddingVertical="$2" borderBottomWidth={1} borderBottomColor="$color4">
                    <Text fontWeight="700">{new Date(session.startedAt).toLocaleString("vi-VN")}</Text>
                    <Text color="$color10">
                      {Math.round(session.durationMs / 60000)} phút · {session.wordsRead} từ · {session.speed}x
                    </Text>
                  </YStack>
                ))
              ) : (
                <Text color="$color10">Chưa có lần đọc nào.</Text>
              )}
            </YStack>
          </Card>

          <Card padding="$4" borderWidth={1} borderColor="$color5">
            <YStack gap="$3">
              <Text fontSize="$5" fontWeight="700">Bản ghi âm ví dụ</Text>
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
                <Text color="$color10">Chưa có bản ghi âm nào.</Text>
              )}
            </YStack>
          </Card>
        </YStack>
      </ScrollView>
    </YStack>
  );
}