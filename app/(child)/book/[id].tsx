import { Card } from "@/src/components/ui/card";
import { Text } from "@/src/components/ui/text";
import * as FileSystem from "expo-file-system";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
    BarChart,
    ChevronLeft,
    Clock,
    FileText,
    Headphones,
    Play,
} from "lucide-react-native";
import { useMemo, useState } from "react";
import { Alert, Image, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AudioPlaybackModal } from "@/src/components/child/AudioPlaybackModal";
import { RecordingTile } from "@/src/components/child/RecordingTile";
import { Button } from "@/src/components/shared/Button";
import { COLORS } from "@/src/core/constants/colors";
import { Recording, storyDetailToBook } from "@/src/core/types";
import { useStoryQuery } from "@/src/hooks/useStoryQueries";
import { useRecordingStore } from "@/src/store/useRecordingStore";

/**
 * Reading Detail Screen (Chi tiết bài đọc)
 * Focused on dyslexia-friendly layout, minimalist content, and clear CTA.
 */
export default function ReadingDetailScreen(): React.ReactElement {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const storyQuery = useStoryQuery(id);
  const book = useMemo(
    () => (storyQuery.data ? storyDetailToBook(storyQuery.data) : null),
    [storyQuery.data],
  );

  const { recordings, removeRecording } = useRecordingStore();

  // Playback Modal State
  const [playbackUri, setPlaybackUri] = useState<string | null>(null);
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
      setSelectedRecordingId(null);
      setPlaybackMeteringData([]);
    }
  };

  const bookRecordings = useMemo(
    () => recordings.filter((recording) => recording.bookId === id),
    [id, recordings],
  );

  const handleOpenPlayback = async (recording: Recording) => {
    try {
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
      setSelectedRecordingId(recording.id);
      setPlaybackMeteringData(recording.meteringData);
      setIsPlaybackOpen(true);
    } catch (error) {
      console.error("Error checking file:", error);
      Alert.alert("Lỗi", "Không thể kiểm tra tập tin âm thanh.");
    }
  };

  if (storyQuery.isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <Text className="text-muted-foreground">Đang tải bài đọc...</Text>
      </View>
    );
  }

  if (!book) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <Text className="text-muted-foreground">
          Không tìm thấy bài đọc này
        </Text>
        <Button className="mt-4" onPress={() => router.back()}>
          Quay lại
        </Button>
      </View>
    );
  }

  const difficultyColor =
    book.difficulty === "easy"
      ? COLORS.easy
      : book.difficulty === "medium"
        ? COLORS.medium
        : COLORS.hard;

  return (
    <View className="flex-1 bg-background">
      {/* 1. Header */}
      <View
        style={{
          paddingTop: insets.top,
          paddingHorizontal: 16,
          paddingVertical: 14,
        }}
        className="flex-row items-center bg-background"
      >
        <Button
          icon={<ChevronLeft size={24} />}
          chromeless
          uiVariant="ghost"
          onPress={() => router.back()}
          padding={0}
          width={40}
        />
        <Text className="text-xl font-bold ml-2">Chi tiết bài đọc</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-4 gap-6 pb-24">
          {/* 2. Hero Section: Cover & Basic Info */}
          <View className="flex-row gap-4">
            <Card className="w-[120px] h-[180px] overflow-hidden">
              <Image
                source={{ uri: book.coverUrl }}
                style={{ width: 120, height: 180 }}
              />
            </Card>

            <View style={{ flex: 1 }} className="justify-center gap-2">
              <Text className="text-primary font-semibold uppercase tracking-wider">
                {book.category}
              </Text>
              <Text className="font-extrabold text-xl" numberOfLines={2}>
                {book.title}
              </Text>
              <Text className="text-muted-foreground">{book.author}</Text>

              <View className="flex-row items-center gap-2 mt-1">
                <View
                  style={{
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 6,
                    backgroundColor: `${difficultyColor}22`,
                  }}
                >
                  <Text
                    style={{ color: difficultyColor }}
                    className="font-semibold uppercase"
                  >
                    Mức độ:{" "}
                    {book.difficulty === "easy"
                      ? "Dễ"
                      : book.difficulty === "medium"
                        ? "Vừa"
                        : "Khó"}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* 3. Info Grid: Quick Stats */}
          <View className="flex-row gap-3">
            <Card className="flex-1 p-3 bg-color2 items-center gap-1">
              <Clock size={20} color="#6B7280" />
              <Text className="font-extrabold text-lg">
                {book.estimatedMinutes}p
              </Text>
              <Text className="text-sm text-muted-foreground">Thời gian</Text>
            </Card>
            <Card className="flex-1 p-3 bg-color2 items-center gap-1">
              <FileText size={20} color="#6B7280" />
              <Text className="font-extrabold text-lg">{book.wordCount}</Text>
              <Text className="text-sm text-muted-foreground">Số từ</Text>
            </Card>
            <Card className="flex-1 p-3 bg-color2 items-center gap-1">
              <BarChart size={20} color="#6B7280" />
              <Text className="font-extrabold text-lg">
                {book.difficulty === "easy"
                  ? "Lv.1"
                  : book.difficulty === "medium"
                    ? "Lv.2"
                    : "Lv.3"}
              </Text>
              <Text className="text-sm text-muted-foreground">Cấp độ</Text>
            </Card>
          </View>

          {/* 4. Primary CTA: Start Reading */}
          <View className="gap-3">
            <Button
              size="large"
              icon={<Play size={20} />}
              onPress={() =>
                router.push({
                  pathname: "/(child)/reading/[id]",
                  params: { id: book.id, mode: "start" },
                })
              }
              uiVariant="primary"
            >
              Bắt đầu bài đọc
            </Button>
            <Text className="text-center text-sm text-muted-foreground">
              Bé hãy ấn nút xanh để bắt đầu hành trình khám phá nhé!
            </Text>
          </View>

          {/* 5. Recent Recordings */}
          {bookRecordings.length > 0 && (
            <View className="gap-4 mt-2">
              <View className="flex-row items-center gap-2">
                <Headphones size={22} />
                <Text className="text-lg font-extrabold">Bản ghi của bé</Text>
              </View>

              <View className="gap-3">
                {bookRecordings.slice(0, 5).map((recording) => (
                  <RecordingTile
                    key={recording.id}
                    recording={recording}
                    onPlay={handleOpenPlayback}
                    onDelete={removeRecording}
                  />
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {(isPlaybackOpen || playbackUri) && (
        <AudioPlaybackModal
          uri={playbackUri}
          title={book.title}
          meteringData={playbackMeteringData}
          open={isPlaybackOpen}
          onOpenChange={handlePlaybackOpenChange}
          onDelete={() =>
            selectedRecordingId && removeRecording(selectedRecordingId)
          }
        />
      )}
    </View>
  );
}
