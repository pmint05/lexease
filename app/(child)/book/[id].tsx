import { Card } from "@/src/components/ui/card";
import { Text } from "@/src/components/ui/text";
import * as FileSystem from "expo-file-system/legacy";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft, Clock, FileText, Play } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Alert, Image, Platform, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AudioPlaybackModal } from "@/src/components/child/AudioPlaybackModal";
import { RecordingTile } from "@/src/components/child/RecordingTile";
import { Button } from "@/src/components/ui/button";
import { Icon } from "@/src/components/ui/icon";
import { Skeleton } from "@/src/components/ui/skeleton";
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

  const isWebPlayableAudioUri = (uri: string): boolean => {
    return /^(https?:|blob:|data:)/i.test(uri);
  };

  const handleOpenPlayback = async (recording: Recording) => {
    try {
      if (Platform.OS === "web") {
        if (!isWebPlayableAudioUri(recording.filePath)) {
          Alert.alert(
            "Lỗi tập tin",
            "Bản ghi này chưa có URI phù hợp để phát trên web. Hãy thử trên thiết bị di động hoặc dùng bản ghi từ web.",
          );
          return;
        }

        setPlaybackUri(recording.filePath);
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
      setSelectedRecordingId(recording.id);
      setPlaybackMeteringData(recording.meteringData);
      setIsPlaybackOpen(true);
    } catch (error) {
      console.error("Error checking file:", error);
      Alert.alert("Lỗi", "Không thể kiểm tra tập tin âm thanh.");
    }
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push("/(child)/(tabs)/library");
    }
  };

  if (storyQuery.isLoading) {
    return (
      <View className="flex-1 bg-background">
        <View className="flex-row items-center bg-background px-4 py-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-6 w-40 ml-3 rounded-full" />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="px-4 gap-6 pb-24">
            <View className="flex-row gap-4">
              <Skeleton className="w-[120px] aspect-[2/3] rounded-md" />
              <View className="flex-1 justify-center gap-2">
                <Skeleton className="h-4 w-24 rounded-full" />
                <Skeleton className="h-8 w-4/5 rounded-full" />
                <Skeleton className="h-4 w-3/5 rounded-full" />
              </View>
            </View>

            <View className="flex-row gap-3">
              <Skeleton className="flex-1 h-20 rounded-lg" />
              <Skeleton className="flex-1 h-20 rounded-lg" />
            </View>

            <View className="gap-3">
              <Skeleton className="h-12 w-full rounded-xl" />
            </View>

            <View className="gap-4 mt-2">
              <Skeleton className="h-6 w-1/3 rounded-full" />
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  if (!book) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <Text className="text-muted-foreground">
          Không tìm thấy bài đọc này
        </Text>
        <Button className="mt-4" onPress={handleBack}>
          <Text>Quay lại</Text>
        </Button>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      {/* 1. Header */}
      <View className="flex-row items-center bg-background px-4 py-3">
        <Button onPress={handleBack} variant="ghost" size="icon">
          <ChevronLeft className="text-foreground size-6" />
        </Button>
        <Text className="text-xl font-bold ml-2">Chi tiết bài đọc</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-4 gap-6 pb-24">
          {/* 2. Hero Section: Cover & Basic Info */}
          <View className="flex-row gap-4">
            <Card className="w-[120px] aspect-[2/3] overflow-hidden p-0">
              <Image
                source={{ uri: book.coverUrl }}
                style={{ width: "100%", height: "100%" }}
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
          </View>

          {/* 4. Primary CTA: Start Reading */}
          <View className="gap-3">
            <Button
              size="lg"
              onPress={() =>
                router.push({
                  pathname: "/(child)/reading/[id]",
                  params: { id: book.id, mode: "start" },
                })
              }
            >
              <Icon as={Play} className="size-4" />
              <Text>Bắt đầu bài đọc</Text>
            </Button>
          </View>

          {/* 5. Recent Recordings */}
          {bookRecordings.length > 0 && (
            <View className="gap-4 mt-2">
              <Text className="text-lg font-extrabold">Bản ghi của bé</Text>

              <View className="gap-3">
                {bookRecordings.map((recording) => (
                  <RecordingTile
                    key={recording.id}
                    recording={recording}
                    onPlay={handleOpenPlayback}
                    onDelete={removeRecording}
                    showTitle={true}
                    showCreateDate={true}
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
        />
      )}
    </View>
  );
}
