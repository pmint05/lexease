import { Button } from "@/src/components/shared/Button";
import { Card } from "@/src/components/ui/card";
import { Text } from "@/src/components/ui/text";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { ScrollView, View } from "react-native";

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
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-muted">Đang tải sách...</Text>
      </View>
    );
  }

  if (!book) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-muted">Không tìm thấy sách.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background px-4 gap-4">
      <View className="flex-row justify-between items-center pt-4">
        <Text className="text-2xl font-bold">Chi tiết sách của bé</Text>
        <Button
          size="$3"
          onPress={() => router.back()}
          accessibilityLabel="Quay lại Guardian dashboard"
        >
          Quay lại
        </Button>
      </View>

      <Card className="p-4 border border-color5">
        <View className="gap-2">
          <Text className="text-xl font-bold">{book.title}</Text>
          <Text className="text-muted">{book.author}</Text>
          <Text className="text-muted">
            Bé đang xem: {selectedChild?.childName ?? "Chưa chọn bé"}
          </Text>
          <Text className="text-muted">
            {bookSessions.length} lần học · {bookRecordings.length} bản ghi
          </Text>
          <View className="flex-row gap-2 mt-2">
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
          </View>
        </View>
      </Card>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="gap-4">
          <Card className="p-4 border border-color5">
            <View className="gap-3">
              <Text className="text-lg font-bold">Các lần đọc</Text>
              {bookSessions.length > 0 ? (
                bookSessions.map((session) => (
                  <View
                    key={session.id}
                    className="py-2 border-b border-color4"
                  >
                    <Text className="font-bold">
                      {new Date(session.startedAt).toLocaleString("vi-VN")}
                    </Text>
                    <Text className="text-muted">
                      {Math.round(session.durationMs / 60000)} phút ·{" "}
                      {session.wordsRead} từ · {session.speed}x
                    </Text>
                  </View>
                ))
              ) : (
                <Text className="text-muted">Chưa có lần đọc nào.</Text>
              )}
            </View>
          </Card>

          <Card className="p-4 border border-color5">
            <View className="gap-3">
              <Text className="text-lg font-bold">Bản ghi âm ví dụ</Text>
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
                <Text className="text-muted">Chưa có bản ghi âm nào.</Text>
              )}
            </View>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}
