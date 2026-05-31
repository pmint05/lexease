import { AudioPlaybackModal } from "@/src/components/child/AudioPlaybackModal";
import {
  HistoryFilterSheet,
  type HistoryPeriodFilter,
  type HistorySortOption,
} from "@/src/components/child/HistoryFilterSheet";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Icon } from "@/src/components/ui/icon";
import { Input } from "@/src/components/ui/input";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Text } from "@/src/components/ui/text";
import { getApiBaseUrl } from "@/src/data/api/apiClient";
import { progressApi } from "@/src/data/api/progressApi";
import { useProgressSessionsQuery } from "@/src/hooks/useProgressQueries";
import { cn } from "@/src/lib/utils";
import { useAuthStore } from "@/src/store/useAuthStore";
import { formatReadingTime } from "@/src/utils/formatters";
import {
  BookOpen,
  Headphones,
  Mic,
  Play,
  Search,
  SlidersHorizontal,
  Trophy,
} from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, View } from "react-native";

export default function HistoryScreen(): React.ReactElement {
  const { user } = useAuthStore();
  const childId = user?.id ?? "";

  const { data: sessions = [], isLoading } = useProgressSessionsQuery(childId);

  const [searchQuery, setSearchQuery] = useState("");
  const [periodFilter, setPeriodFilter] = useState<HistoryPeriodFilter>("all");
  const [sortOption, setSortOption] = useState<HistorySortOption>("newest");
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  const [playbackUri, setPlaybackUri] = useState<string | null>(null);
  const [playbackTitle, setPlaybackTitle] = useState("");
  const [isPlaybackOpen, setIsPlaybackOpen] = useState(false);
  const [isFetchingAudio, setIsFetchingAudio] = useState(false);

  const handlePlaybackOpenChange = (nextOpen: boolean) => {
    setIsPlaybackOpen(nextOpen);
    if (!nextOpen) {
      setPlaybackUri(null);
      setPlaybackTitle("");
    }
  };

  const fixAudioUrl = (url?: string | null): string => {
    if (!url) return "";
    const baseUrl = getApiBaseUrl();
    try {
      const apiOrigin = new URL(baseUrl).origin;
      if (url.includes("localhost:8080")) {
        return url.replace("http://localhost:8080", apiOrigin);
      }
    } catch (e) {
      // Ignore
    }
    return url;
  };

  const handleOpenPlayback = async (sessionId: string, bookTitle: string) => {
    try {
      setIsFetchingAudio(true);
      const detail = await progressApi.getSessionDetail(childId, sessionId);
      const recording = detail.recordings[0]; // Play the first recording available

      if (!recording || !recording.audioUrl) {
        alert("Buổi học này không có bản ghi âm.");
        return;
      }

      setPlaybackUri(fixAudioUrl(recording.audioUrl));
      setPlaybackTitle(bookTitle);
      setIsPlaybackOpen(true);
    } catch (error) {
      console.error("Error fetching recording:", error);
    } finally {
      setIsFetchingAudio(false);
    }
  };

  const filteredSessions = useMemo(() => {
    const now = Date.now();
    const normalizedQuery = searchQuery.trim().toLowerCase();

    let filtered = sessions.filter((s) => {
      if (normalizedQuery.length > 0) {
        if (!s.storyTitle.toLowerCase().includes(normalizedQuery)) return false;
      }

      if (periodFilter === "all") return true;

      const ageMs = now - new Date(s.startedAt).getTime();
      const limitMs =
        periodFilter === "7d"
          ? 7 * 24 * 60 * 60 * 1000
          : 30 * 24 * 60 * 60 * 1000;

      return ageMs <= limitMs;
    });

    return filtered.sort((left, right) => {
      switch (sortOption) {
        case "oldest":
          return (
            new Date(left.startedAt).getTime() -
            new Date(right.startedAt).getTime()
          );
        case "longest":
          return (right.elapsedMs ?? 0) - (left.elapsedMs ?? 0);
        case "shortest":
          return (left.elapsedMs ?? 0) - (right.elapsedMs ?? 0);
        case "title-asc":
          return left.storyTitle.localeCompare(right.storyTitle, "vi-VN");
        case "title-desc":
          return right.storyTitle.localeCompare(left.storyTitle, "vi-VN");
        case "newest":
        default:
          return (
            new Date(right.startedAt).getTime() -
            new Date(left.startedAt).getTime()
          );
      }
    });
  }, [sessions, searchQuery, periodFilter, sortOption]);

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    periodFilter !== "all" ||
    sortOption !== "newest";

  const clearFilters = () => {
    setSearchQuery("");
    setPeriodFilter("all");
    setSortOption("newest");
  };

  return (
    <View className="flex-1 bg-background px-4">
      <FlatList
        data={filteredSessions}
        keyExtractor={(item) => item.sessionId}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 100 }}
        ListHeaderComponent={
          <View className="mb-4 gap-4">
            <View className="gap-2">
              <Text className="text-2xl font-bold">Lịch sử buổi học</Text>
              <Text className="text-sm text-muted-foreground">
                Xem lại những bài bé đã đọc và nghe lại giọng đọc của mình nhé!
              </Text>
            </View>

            <View className="gap-2">
              <View className="flex-row items-center gap-2">
                <View className="relative flex-1">
                  <View className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                    <Icon
                      as={Search}
                      className="text-muted-foreground"
                      size={18}
                    />
                  </View>
                  <Input
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Tìm theo tên truyện"
                    autoCapitalize="none"
                    autoCorrect={false}
                    className="pl-10"
                  />
                </View>

                <Button
                  size="icon"
                  variant={hasActiveFilters ? "default" : "outline"}
                  className="shrink-0"
                  onPress={() => setIsFilterSheetOpen(true)}
                >
                  <Icon as={SlidersHorizontal} size={18} />
                </Button>
              </View>

              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-muted-foreground font-medium">
                  {filteredSessions.length} buổi học
                </Text>
              </View>
            </View>
          </View>
        }
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        renderItem={({ item }) => (
          <SessionHistoryCard
            session={item}
            onPlay={() => handleOpenPlayback(item.sessionId, item.storyTitle)}
            isFetchingAudio={isFetchingAudio}
          />
        )}
        ListEmptyComponent={
          isLoading ? (
            <View className="gap-3">
              <Skeleton className="h-24 w-full rounded-2xl" />
              <Skeleton className="h-24 w-full rounded-2xl" />
              <Skeleton className="h-24 w-full rounded-2xl" />
            </View>
          ) : (
            <View className="py-10 items-center gap-2">
              <Headphones size={48} color="#9CA3AF" />
              <Text className="text-muted-foreground text-center">
                {hasActiveFilters
                  ? "Không tìm thấy buổi học nào phù hợp."
                  : "Bé chưa có buổi học nào. Hãy bắt đầu đọc truyện ngay nhé!"}
              </Text>
            </View>
          )
        }
        showsVerticalScrollIndicator={false}
      />

      {(isPlaybackOpen || playbackUri) && (
        <AudioPlaybackModal
          uri={playbackUri}
          title={playbackTitle}
          open={isPlaybackOpen}
          onOpenChange={handlePlaybackOpenChange}
        />
      )}

      {isFetchingAudio && (
        <View className="absolute inset-0 !bg-black/50 items-center justify-center pointer-events-none">
          <View className="bg-card p-4 rounded-2xl shadow-lg border border-border items-center">
            <ActivityIndicator color="#6366F1" />
            <Text className="text-xs font-medium mt-2">
              Đang tải âm thanh...
            </Text>
          </View>
        </View>
      )}

      <HistoryFilterSheet
        open={isFilterSheetOpen}
        onOpenChange={setIsFilterSheetOpen}
        searchQuery={searchQuery}
        periodFilter={periodFilter}
        sortOption={sortOption}
        filteredCount={filteredSessions.length}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={clearFilters}
        onPeriodChange={setPeriodFilter}
        onSortChange={setSortOption}
      />
    </View>
  );
}

function SessionHistoryCard({
  session,
  onPlay,
  isFetchingAudio,
}: {
  session: any;
  onPlay: () => void;
  isFetchingAudio: boolean;
}) {
  const accuracy = Math.round((session.latestAccuracy ?? 0) * 100);
  const hasRecording = session.recordingCount > 0;

  return (
    <Card className="overflow-hidden border-border bg-card active:bg-muted/5 py-0">
      <CardContent className="p-0">
        <View className="flex-row items-center p-4 gap-4">
          {/* Icon/Cover Placeholder */}
          <View className="size-14 rounded-2xl bg-primary/10 items-center justify-center">
            <BookOpen size={28} className="text-primary" />
          </View>

          {/* Info */}
          <View className="flex-1">
            <Text
              className="font-bold text-lg text-foreground"
              numberOfLines={1}
            >
              {session.storyTitle}
            </Text>
            <View className="flex-row items-center gap-3 mt-0.5">
              <View className="flex-row items-center gap-1">
                <Trophy size={12} className="text-accent" />
                <Text className="text-xs font-bold text-accent">
                  {accuracy}%
                </Text>
              </View>
              <View className="flex-row items-center gap-1">
                <Mic size={12} className="text-muted-foreground" />
                <Text className="text-xs text-muted-foreground">
                  {session.recordingCount} bản ghi
                </Text>
              </View>
              <Text className="text-[10px] text-muted-foreground">•</Text>
              <Text className="text-xs text-muted-foreground">
                {formatReadingTime(session.elapsedMs)}
              </Text>
            </View>
            <Text className="text-[10px] text-muted-foreground mt-1 uppercase font-bold">
              {new Date(session.startedAt).toLocaleDateString("vi-VN")} -{" "}
              {new Date(session.startedAt).toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>

          {/* Action */}
          {hasRecording ? (
            <Pressable
              onPress={onPlay}
              disabled={isFetchingAudio}
              className={cn(
                "size-10 rounded-full items-center justify-center border border-primary/20 bg-primary/5",
                isFetchingAudio && "opacity-50",
              )}
            >
              <Play size={20} fill="#6366F1" className="text-primary ml-0.5" />
            </Pressable>
          ) : (
            <></>
          )}
        </View>
      </CardContent>
    </Card>
  );
}
