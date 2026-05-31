import { Text } from "@/src/components/ui/text";
import * as FileSystem from "expo-file-system/legacy";
import { Headphones, Search, SlidersHorizontal } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { Alert, FlatList, Platform, View } from "react-native";

import { AudioPlaybackModal } from "@/src/components/child/AudioPlaybackModal";
import {
    HistoryFilterSheet,
    type HistoryPeriodFilter,
    type HistorySortOption,
} from "@/src/components/child/HistoryFilterSheet";
import { RecordingTile } from "@/src/components/child/RecordingTile";
import { Button } from "@/src/components/ui/button";
import { Icon } from "@/src/components/ui/icon";
import { Input } from "@/src/components/ui/input";
import { Recording } from "@/src/core/types";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useRecordingStore } from "@/src/store/useRecordingStore";

export default function HistoryScreen(): React.ReactElement {
  const { user } = useAuthStore();
  const { recordings, removeRecording } = useRecordingStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [periodFilter, setPeriodFilter] = useState<HistoryPeriodFilter>("all");
  const [sortOption, setSortOption] = useState<HistorySortOption>("newest");
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  const [playbackUri, setPlaybackUri] = useState<string | null>(null);
  const [playbackTitle, setPlaybackTitle] = useState("");
  const [selectedRecordingId, setSelectedRecordingId] = useState<string | null>(
    null,
  );
  const [playbackMeteringData, setPlaybackMeteringData] = useState<
    number[] | undefined
  >([]);
  const [isPlaybackOpen, setIsPlaybackOpen] = useState(false);

  const handlePlaybackOpenChange = (nextOpen: boolean) => {
    setIsPlaybackOpen(nextOpen);

    if (!nextOpen) {
      setPlaybackUri(null);
      setPlaybackTitle("");
      setSelectedRecordingId(null);
      setPlaybackMeteringData([]);
    }
  };

  const filteredRecordings = useMemo<Recording[]>(() => {
    const now = Date.now();
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const filtered = recordings
      .filter((recording) => recording.childId === user?.id)
      .filter((recording) => {
        if (normalizedQuery.length > 0) {
          const title = recording.bookTitle.toLowerCase();
          if (!title.includes(normalizedQuery)) {
            return false;
          }
        }

        if (periodFilter === "all") {
          return true;
        }

        const ageMs = now - new Date(recording.createdAt).getTime();
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
            new Date(left.createdAt).getTime() -
            new Date(right.createdAt).getTime()
          );
        case "longest":
          return (right.durationMs ?? 0) - (left.durationMs ?? 0);
        case "shortest":
          return (left.durationMs ?? 0) - (right.durationMs ?? 0);
        case "title-asc":
          return left.bookTitle.localeCompare(right.bookTitle, "vi-VN");
        case "title-desc":
          return right.bookTitle.localeCompare(left.bookTitle, "vi-VN");
        case "newest":
        default:
          return (
            new Date(right.createdAt).getTime() -
            new Date(left.createdAt).getTime()
          );
      }
    });
  }, [periodFilter, recordings, searchQuery, sortOption, user?.id]);

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    periodFilter !== "all" ||
    sortOption !== "newest";

  const clearFilters = () => {
    setSearchQuery("");
    setPeriodFilter("all");
    setSortOption("newest");
  };

  const handleOpenPlayback = async (recording: Recording) => {
    try {
      if (Platform.OS === "web") {
        const webUri = (recording as any).webUri ?? recording.filePath;
        if (!webUri) {
          Alert.alert(
            "Lỗi tập tin",
            "Không tìm thấy đường dẫn bản ghi trên web.",
          );
          return;
        }

        let ok = false;
        try {
          const head = await fetch(webUri, { method: "HEAD" });
          ok = head.ok;
        } catch {
          try {
            const get = await fetch(webUri);
            ok = get.ok;
          } catch {
            ok = false;
          }
        }

        if (!ok) {
          Alert.alert(
            "Lỗi tập tin",
            "Không thể truy cập file âm thanh trên web. Hãy kiểm tra file hoặc dùng thiết bị thật để phát lại.",
          );
          return;
        }

        setPlaybackUri(webUri);
        setPlaybackTitle(recording.bookTitle);
        setSelectedRecordingId(recording.id);
        setPlaybackMeteringData(recording.meteringData);
        setIsPlaybackOpen(true);
        return;
      }

      const fileInfo = await FileSystem.getInfoAsync(recording.filePath);

      if (!fileInfo.exists) {
        Alert.alert(
          "Lỗi tập tin",
          "Bản ghi âm này không còn tồn tại trên thiết bị. Bé có muốn xóa thông tin bản ghi này không?",
          [
            { text: "Để sau", style: "cancel" },
            {
              text: "Xóa ngay",
              style: "destructive",
              onPress: () => removeRecording(recording.id),
            },
          ],
        );
        return;
      }

      setPlaybackUri(recording.filePath);
      setPlaybackTitle(recording.bookTitle);
      setSelectedRecordingId(recording.id);
      setPlaybackMeteringData(recording.meteringData);
      setIsPlaybackOpen(true);
    } catch (error) {
      console.error("Error checking file:", error);
      Alert.alert("Lỗi", "Không thể kiểm tra tập tin âm thanh.");
    }
  };

  return (
    <View className="flex-1 bg-background px-4">
      <FlatList
        data={filteredRecordings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 100 }}
        ListHeaderComponent={
          <View className="mb-4 gap-4">
            <View className="gap-2">
              <Text className="text-2xl font-bold">Lịch sử ghi âm</Text>
              <Text className="text-sm text-muted-foreground">
                Tìm nhanh bản ghi theo tên sách, khoảng thời gian hoặc cách sắp
                xếp.
              </Text>
            </View>

            <View className="gap-2">
              <Text className="text-sm font-medium text-muted-foreground">
                Tìm kiếm
              </Text>
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
                    placeholder="Tìm theo tên sách"
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
                <Text className="text-sm text-muted-foreground">
                  {filteredRecordings.length} bản ghi
                </Text>
                {hasActiveFilters ? (
                  <Text className="text-sm text-muted-foreground">
                    Đang áp dụng bộ lọc
                  </Text>
                ) : null}
              </View>
            </View>
          </View>
        }
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        renderItem={({ item }) => (
          <RecordingTile
            recording={item}
            showTitle={true}
            showCreateDate={true}
            onPlay={handleOpenPlayback}
            onDelete={removeRecording}
          />
        )}
        ListEmptyComponent={
          <View className="py-10 items-center gap-2">
            <Headphones size={48} color="#9CA3AF" />
            <Text className="text-muted-foreground text-center">
              {hasActiveFilters
                ? "Không tìm thấy bản ghi phù hợp với bộ lọc hiện tại."
                : "Chưa có ghi âm nào. Hãy bắt đầu đọc sách để lưu giữ giọng đọc của bé nhé!"}
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />

      {(isPlaybackOpen || playbackUri) && (
        <AudioPlaybackModal
          uri={playbackUri}
          title={playbackTitle}
          meteringData={playbackMeteringData}
          open={isPlaybackOpen}
          onOpenChange={handlePlaybackOpenChange}
        />
      )}

      <HistoryFilterSheet
        open={isFilterSheetOpen}
        onOpenChange={setIsFilterSheetOpen}
        searchQuery={searchQuery}
        periodFilter={periodFilter}
        sortOption={sortOption}
        filteredCount={filteredRecordings.length}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={clearFilters}
        onPeriodChange={setPeriodFilter}
        onSortChange={setSortOption}
      />
    </View>
  );
}
