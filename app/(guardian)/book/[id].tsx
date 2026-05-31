import { Button } from "@/src/components/shared/Button";
import { Card } from "@/src/components/ui/card";
import { Switch } from "@/src/components/ui/switch";
import { Text } from "@/src/components/ui/text";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";

import { RecordingTile } from "@/src/components/child/RecordingTile";
import { storyDetailToBook } from "@/src/core/types";
import { useAudioRecording } from "@/src/hooks/useAudioRecording";
import { useGuardianChildLinksQuery } from "@/src/hooks/useFamilyQueries";
import {
  useBlockStoryMutation,
  useStoryQuery,
  useUnblockStoryMutation,
} from "@/src/hooks/useStoryQueries";
import { cn } from "@/src/lib/utils";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useFamilyStore } from "@/src/store/useFamilyStore";
import { useLearningStore } from "@/src/store/useLearningStore";
import { useRecordingStore } from "@/src/store/useRecordingStore";
import {
  BookOpen,
  ChevronLeft,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react-native";

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
          childName:
            link.childEmail?.split("@")[0] || `Bé ${link.childId.slice(0, 4)}`,
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

  const isBlocked = storyQuery.data?.isBlockedForCurrentChild ?? false;

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

  const toggleBlocking = (checked: boolean) => {
    if (!selectedChildId || !id) return;
    if (checked) {
      unblockStoryMutation.mutate({ childId: selectedChildId, storyId: id });
    } else {
      blockStoryMutation.mutate({
        childId: selectedChildId,
        storyId: id,
        reason: "Guardian restricted access from app",
      });
    }
  };

  if (storyQuery.isLoading) {
    return (
      <View className="flex-1 justify-center items-center p-4 bg-background">
        <ActivityIndicator size="large" color="#FF6B00" />
        <Text className="text-muted-foreground mt-2">
          Đang tải thông tin sách...
        </Text>
      </View>
    );
  }

  if (!book) {
    return (
      <View className="flex-1 justify-center items-center p-4 bg-background">
        <Text className="text-muted-foreground">Không tìm thấy sách.</Text>
        <Button className="mt-4" onPress={() => router.back()}>
          Quay lại
        </Button>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background px-4">
      <View className="flex-row justify-between items-center pt-4 mb-4">
        <Button
          variant="ghost"
          size="icon"
          onPress={() => router.back()}
          className="rounded-full bg-muted/30"
        >
          <ChevronLeft size={24} className="text-foreground" />
        </Button>
        <Text className="text-xl font-bold">Chi tiết sách</Text>
        <View className="w-10" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-10"
      >
        <View className="gap-4">
          {/* Header Info */}
          <Card className="p-5 border-border bg-card">
            <View className="flex-row gap-4">
              <View className="size-20 bg-primary/10 rounded-xl items-center justify-center">
                <BookOpen size={40} className="text-primary" />
              </View>
              <View className="flex-1 justify-center">
                <Text
                  className="text-xl font-bold text-foreground"
                  numberOfLines={1}
                >
                  {book.title}
                </Text>
                <Text className="text-muted-foreground">{book.author}</Text>
                <Text className="text-xs text-primary font-bold uppercase mt-1 tracking-wider">
                  {book.category}
                </Text>
              </View>
            </View>

            <View className="mt-4 pt-4 border-t border-border flex-row justify-between items-center">
              <View>
                <Text className="text-xs text-muted-foreground">
                  Đang xem cho:
                </Text>
                <Text className="font-bold text-foreground">
                  {selectedChild?.childName ?? "Tất cả các bé"}
                </Text>
              </View>
              <View className="items-end">
                <Text className="text-xs text-muted-foreground">Thống kê:</Text>
                <Text className="font-bold text-foreground">
                  {bookSessions.length} buổi · {bookRecordings.length} bản ghi
                </Text>
              </View>
            </View>
          </Card>

          {/* Access Control */}
          <Card
            className={cn(
              "p-4 border-2",
              isBlocked
                ? "border-destructive/20 bg-destructive/5"
                : "border-accent/20 bg-accent/5",
            )}
          >
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center gap-3 flex-1">
                {isBlocked ? (
                  <ShieldAlert size={24} className="text-destructive" />
                ) : (
                  <ShieldCheck size={24} className="text-accent" />
                )}
                <View className="flex-1">
                  <Text className="font-bold text-foreground">
                    {isBlocked ? "Sách đang bị chặn" : "Bé có thể đọc sách này"}
                  </Text>
                  <Text className="text-xs text-muted-foreground">
                    {isBlocked
                      ? "Bé sẽ không thấy truyện này trong thư viện"
                      : "Bé có thể tìm thấy và luyện đọc truyện này"}
                  </Text>
                </View>
              </View>
              <Switch
                checked={!isBlocked}
                onCheckedChange={toggleBlocking}
                disabled={
                  blockStoryMutation.isPending ||
                  unblockStoryMutation.isPending ||
                  !selectedChildId
                }
              />
            </View>
          </Card>

          {/* Reading Sessions */}
          <View className="gap-3">
            <Text className="text-lg font-bold ml-1">Lịch sử luyện tập</Text>
            <Card className="border-border">
              <View className="p-2">
                {bookSessions.length > 0 ? (
                  bookSessions.map((session, index) => (
                    <View
                      key={session.id}
                      className={cn(
                        "p-3 flex-row justify-between items-center",
                        index !== bookSessions.length - 1 &&
                          "border-b border-border/50",
                      )}
                    >
                      <View>
                        <Text className="font-bold text-foreground">
                          {new Date(session.startedAt).toLocaleDateString(
                            "vi-VN",
                          )}
                        </Text>
                        <Text className="text-xs text-muted-foreground">
                          {new Date(session.startedAt).toLocaleTimeString(
                            "vi-VN",
                            { hour: "2-digit", minute: "2-digit" },
                          )}
                        </Text>
                      </View>
                      <View className="items-end">
                        <Text className="font-bold text-primary">
                          {Math.round(session.durationMs / 60000)} phút
                        </Text>
                        <Text className="text-xs text-muted-foreground">
                          {session.wordsRead} từ · {session.speed} WPM
                        </Text>
                      </View>
                    </View>
                  ))
                ) : (
                  <View className="p-8 items-center">
                    <Text className="text-muted-foreground italic">
                      Chưa có lần đọc nào.
                    </Text>
                  </View>
                )}
              </View>
            </Card>
          </View>

          {/* Recordings Sample */}
          <View className="gap-3">
            <Text className="text-lg font-bold ml-1">Bản ghi âm gần đây</Text>
            {bookRecordings.length > 0 ? (
              bookRecordings.slice(0, 5).map((recording) => (
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
              <Card className="p-8 items-center border-dashed">
                <Text className="text-muted-foreground italic">
                  Chưa có bản ghi âm nào.
                </Text>
              </Card>
            )}
            {bookRecordings.length > 5 && (
              <Button variant="ghost" size="sm" className="mt-1">
                <Text className="text-primary font-bold">
                  Xem tất cả {bookRecordings.length} bản ghi
                </Text>
              </Button>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
