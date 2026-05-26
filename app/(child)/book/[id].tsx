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
import { Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
    Card,
    H3,
    Image,
    ScrollView,
    Text,
    View,
    XStack,
    YStack,
} from "tamagui";

import { AudioPlaybackModal } from "@/src/components/child/AudioPlaybackModal";
import { RecordingTile } from "@/src/components/child/RecordingTile";
import { Button } from "@/src/components/shared/Button";
import { COLORS } from "@/src/core/constants/colors";
import { Recording } from "@/src/core/types";
import { getBookById } from "@/src/data/local/books";
import { useAudioRecording } from "@/src/hooks/useAudioRecording";
import { useLearningStore } from "@/src/store/useLearningStore";
import { useReadingStore } from "@/src/store/useReadingStore";
import { useRecordingStore } from "@/src/store/useRecordingStore";

/**
 * Reading Detail Screen (Chi tiết bài đọc)
 * Focused on dyslexia-friendly layout, minimalist content, and clear CTA.
 */
export default function ReadingDetailScreen(): React.ReactElement {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const book = useMemo(() => getBookById(id), [id]);

  const { sessions } = useLearningStore();
  const { recordings, removeRecording } = useRecordingStore();
  const { playbackRecording } = useAudioRecording();
  const { backgroundColor } = useReadingStore();

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

  if (!book) {
    return (
      <YStack
        flex={1}
        justifyContent="center"
        alignItems="center"
        backgroundColor="$background"
      >
        <Text color="$mutedForeground">Không tìm thấy bài đọc này</Text>
        <Button marginTop="$4" onPress={() => router.back()}>
          Quay lại
        </Button>
      </YStack>
    );
  }

  const difficultyColor =
    book.difficulty === "easy"
      ? COLORS.easy
      : book.difficulty === "medium"
        ? COLORS.medium
        : COLORS.hard;

  return (
    <YStack flex={1} backgroundColor="$background">
      {/* 1. Header */}
      <XStack
        paddingTop={insets.top}
        paddingHorizontal="$4"
        paddingVertical="$3.5"
        alignItems="center"
        backgroundColor="$background"
      >
        <Button
          icon={<ChevronLeft size={24} />}
          chromeless
          size={"xsmall"}
          uiVariant="ghost"
          onPress={() => router.back()}
          padding={0}
          width={40}
          marginLeft="$-2"
        />
        <Text fontSize="$5" fontWeight="700" flex={1}>
          Chi tiết bài đọc
        </Text>
      </XStack>

      <ScrollView showsVerticalScrollIndicator={false}>
        <YStack paddingHorizontal="$4" gap="$6" paddingBottom={100}>
          {/* 2. Hero Section: Cover & Basic Info */}
          <XStack gap="$4">
            <Card
              width={120}
              height={180}
              borderRadius="$4"
              overflow="hidden"
              borderColor="$border"
            >
              <Image
                source={{ uri: book.coverUrl, width: 120, height: 180 }}
                width="100%"
                height="100%"
                backgroundColor="$color4"
              />
            </Card>

            <YStack flex={1} justifyContent="center" gap="$2">
              <Text
                fontSize="$2"
                color="$primary"
                fontWeight="700"
                textTransform="uppercase"
                letterSpacing={1}
              >
                {book.category}
              </Text>
              <H3 fontWeight="900" lineHeight={28}>
                {book.title}
              </H3>
              <Text color="$mutedForeground" fontSize="$4">
                {book.author}
              </Text>

              <XStack alignItems="center" gap="$2" marginTop="$1">
                <View
                  paddingHorizontal="$2"
                  paddingVertical="$1"
                  borderRadius="$2"
                  backgroundColor={`${difficultyColor}22`}
                >
                  <Text
                    color={difficultyColor}
                    fontWeight="700"
                    fontSize="$2"
                    textTransform="uppercase"
                  >
                    Mức độ:{" "}
                    {book.difficulty === "easy"
                      ? "Dễ"
                      : book.difficulty === "medium"
                        ? "Vừa"
                        : "Khó"}
                  </Text>
                </View>
              </XStack>
            </YStack>
          </XStack>

          {/* 3. Info Grid: Quick Stats */}
          <XStack gap="$3">
            <Card
              flex={1}
              padding="$3"
              alignItems="center"
              gap="$1"
              backgroundColor="$color2"
            >
              <Clock size={20} color="$mutedForeground" />
              <Text fontWeight="800" fontSize="$4">
                {book.estimatedMinutes}p
              </Text>
              <Text fontSize="$1" color="$mutedForeground">
                Thời gian
              </Text>
            </Card>
            <Card
              flex={1}
              padding="$3"
              alignItems="center"
              gap="$1"
              backgroundColor="$color2"
            >
              <FileText size={20} color="$mutedForeground" />
              <Text fontWeight="800" fontSize="$4">
                {book.wordCount}
              </Text>
              <Text fontSize="$1" color="$mutedForeground">
                Số từ
              </Text>
            </Card>
            <Card
              flex={1}
              padding="$3"
              alignItems="center"
              gap="$1"
              backgroundColor="$color2"
            >
              <BarChart size={20} color="$mutedForeground" />
              <Text fontWeight="800" fontSize="$4">
                {book.difficulty === "easy"
                  ? "Lv.1"
                  : book.difficulty === "medium"
                    ? "Lv.2"
                    : "Lv.3"}
              </Text>
              <Text fontSize="$1" color="$mutedForeground">
                Cấp độ
              </Text>
            </Card>
          </XStack>

          {/* 4. Primary CTA: Start Reading */}
          <YStack gap="$3">
            <Button
              size="large"
              icon={<Play size={20} fill="white" />}
              onPress={() =>
                router.push({
                  pathname: "/(child)/reading/[id]",
                  params: { id: book.id },
                })
              }
              uiVariant="primary"
              borderRadius="$6"
              shadowColor="$primary"
              shadowRadius={15}
              shadowOpacity={0.2}
              backgroundColor={"$primary"}
            >
              Bắt đầu bài đọc
            </Button>
            <Text textAlign="center" fontSize="$2" color="$mutedForeground">
              Bé hãy ấn nút xanh để bắt đầu hành trình khám phá nhé!
            </Text>
          </YStack>

          {/* 5. Recent Recordings */}
          {bookRecordings.length > 0 && (
            <YStack gap="$4" marginTop="$2">
              <XStack alignItems="center" gap="$2">
                <Headphones size={22} />
                <Text fontSize="$5" fontWeight="900">
                  Bản ghi của bé
                </Text>
              </XStack>

              <YStack gap="$3">
                {bookRecordings.slice(0, 5).map((recording) => (
                  <RecordingTile
                    key={recording.id}
                    recording={recording}
                    onPlay={handleOpenPlayback}
                    onDelete={removeRecording}
                  />
                ))}
              </YStack>
            </YStack>
          )}
        </YStack>
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
    </YStack>
  );
}
