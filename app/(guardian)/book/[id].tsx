import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { Button, Card, ScrollView, Text, XStack, YStack } from "tamagui";

import { RecordingTile } from "@/src/components/child/RecordingTile";
import { storyDetailToBook } from "@/src/core/types";
import { useAudioRecording } from "@/src/hooks/useAudioRecording";
import { useGuardianChildLinksQuery } from "@/src/hooks/useFamilyQueries";
import {
  useBlockStoryMutation,
  useStoryQuery,
  useUnblockStoryMutation,
} from "@/src/hooks/useStoryQueries";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useFamilyStore } from "@/src/store/useFamilyStore";
import { useLearningStore } from "@/src/store/useLearningStore";
import { useRecordingStore } from "@/src/store/useRecordingStore";

export default function GuardianBookDetailScreen(): React.ReactElement {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuthStore();
  const guardianId = user?.id ?? "";
  const { sessions } = useLearningStore();
  const { recordings, removeRecording } = useRecordingStore();
  const { playbackRecording } = useAudioRecording();
  const selectedChildId = useFamilyStore((state) =>
    guardianId ? state.getSelectedChildId(guardianId) : null,
  );
  const linksQuery = useGuardianChildLinksQuery();
  const storyQuery = useStoryQuery(id, selectedChildId ?? undefined);
  const blockStoryMutation = useBlockStoryMutation();
  const unblockStoryMutation = useUnblockStoryMutation();

  const children = useMemo(
    () =>
      (linksQuery.data ?? [])
        .filter(
          (link) =>
            link.guardianId === guardianId && link.status === "ACCEPTED",
        )
        .map((link) => ({
          childId: link.childId,
          childName: `Bé ${link.childId.slice(0, 8)}`,
        })),
    [guardianId, linksQuery.data],
  );

  const selectedChild = useMemo(
    () => children.find((child) => child.childId === selectedChildId) ?? null,
    [children, selectedChildId],
  );

  const book = useMemo(
    () => (storyQuery.data ? storyDetailToBook(storyQuery.data) : null),
    [storyQuery.data],
  );
  const bookSessions = useMemo(
    () =>
      sessions.filter(
        (session) =>
          session.bookId === id &&
          (!selectedChildId || session.childId === selectedChildId),
      ),
    [id, selectedChildId, sessions],
  );
  const bookRecordings = useMemo(
    () =>
      recordings.filter(
        (recording) =>
          recording.bookId === id &&
          (!selectedChildId || recording.childId === selectedChildId),
      ),
    [id, recordings, selectedChildId],
  );

  if (storyQuery.isLoading) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" padding="$4">
        <Text color="$muted">Đang tải sách...</Text>
      </YStack>
    );
  }

  if (!book) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" padding="$4">
        <Text color="$muted">Không tìm thấy sách.</Text>
      </YStack>
    );
  }

  return (
    <YStack
      flex={1}
      backgroundColor="$background"
      paddingHorizontal="$4"
      gap="$4"
    >
      <XStack
        justifyContent="space-between"
        alignItems="center"
        paddingTop="$4"
      >
        <Text fontSize="$6" fontWeight="700">
          Chi tiết sách của bé
        </Text>
        <Button
          size="$3"
          onPress={() => router.back()}
          accessibilityLabel="Quay lại Guardian dashboard"
        >
          Quay lại
        </Button>
      </XStack>

      <Card padding="$4" borderWidth={1} borderColor="$color5">
        <YStack gap="$2">
          <Text fontSize="$6" fontWeight="700">
            {book.title}
          </Text>
          <Text color="$color10">{book.author}</Text>
          <Text color="$color10">
            Bé đang xem: {selectedChild?.childName ?? "Chưa chọn bé"}
          </Text>
          <Text color="$color10">
            {bookSessions.length} lần học · {bookRecordings.length} bản ghi
          </Text>
          <XStack gap="$2" marginTop="$2">
            <Button
              size="$3"
              disabled={!selectedChildId || blockStoryMutation.isPending}
              onPress={() =>
                selectedChildId &&
                blockStoryMutation.mutate({
                  childId: selectedChildId,
                  storyId: book.id,
                  reason: "Guardian blocked from frontend",
                })
              }
            >
              Chặn sách
            </Button>
            <Button
              size="$3"
              variant="outlined"
              disabled={!selectedChildId || unblockStoryMutation.isPending}
              onPress={() =>
                selectedChildId &&
                unblockStoryMutation.mutate({
                  childId: selectedChildId,
                  storyId: book.id,
                })
              }
            >
              Bỏ chặn
            </Button>
          </XStack>
        </YStack>
      </Card>

      <ScrollView showsVerticalScrollIndicator={false}>
        <YStack gap="$4">
          <Card padding="$4" borderWidth={1} borderColor="$color5">
            <YStack gap="$3">
              <Text fontSize="$5" fontWeight="700">
                Các lần đọc
              </Text>
              {bookSessions.length > 0 ? (
                bookSessions.map((session) => (
                  <YStack
                    key={session.id}
                    paddingVertical="$2"
                    borderBottomWidth={1}
                    borderBottomColor="$color4"
                  >
                    <Text fontWeight="700">
                      {new Date(session.startedAt).toLocaleString("vi-VN")}
                    </Text>
                    <Text color="$color10">
                      {Math.round(session.durationMs / 60000)} phút ·{" "}
                      {session.wordsRead} từ · {session.speed}x
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
              <Text fontSize="$5" fontWeight="700">
                Bản ghi âm ví dụ
              </Text>
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
