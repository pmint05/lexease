import { Text } from "@/src/components/ui/text";
import * as FileSystem from "expo-file-system/legacy";
import { Headphones } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { Alert, FlatList, Platform, View } from "react-native";

import { AudioPlaybackModal } from "@/src/components/child/AudioPlaybackModal";
import { RecordingTile } from "@/src/components/child/RecordingTile";
import { Recording } from "@/src/core/types";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useRecordingStore } from "@/src/store/useRecordingStore";

/**
 * History Screen
 * Displays child's past recordings and reading history
 */
export default function HistoryScreen(): React.ReactElement {
  const { user } = useAuthStore();
  const { recordings, removeRecording } = useRecordingStore();

  // Playback State
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

  const sortedRecordings = useMemo<Recording[]>(() => {
    return recordings
      .filter((recording) => recording.childId === user?.id)
      .sort(
        (left, right) =>
          new Date(right.createdAt).getTime() -
          new Date(left.createdAt).getTime(),
      );
  }, [recordings, user?.id]);

  const handleOpenPlayback = async (recording: Recording) => {
    try {
      if (Platform.OS === "web") {
        // On web, recordings may be stored as blob: or http(s) URLs.
        // Try to fetch the resource (HEAD then GET) to detect availability.
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

      // Native platforms: use expo-file-system to verify file exists
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
        data={sortedRecordings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 100 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        renderItem={({ item }) => (
          <RecordingTile
            recording={item}
            showTitle={true}
            onPlay={handleOpenPlayback}
            onDelete={removeRecording}
          />
        )}
        ListEmptyComponent={
          <View className="py-10 items-center gap-2">
            <Headphones size={48} color="#9CA3AF" />
            <Text className="text-muted-foreground text-center">
              Chưa có ghi âm nào. Hãy bắt đầu đọc sách để lưu giữ giọng đọc của
              bé nhé!
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
          onDelete={() =>
            selectedRecordingId && removeRecording(selectedRecordingId)
          }
        />
      )}
    </View>
  );
}
