import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { Alert, FlatList } from "react-native";
import { Text, XStack, YStack } from "tamagui";

import { RecordingTile } from "@/src/components/child/RecordingTile";
import { COLORS } from "@/src/core/constants/colors";
import { Recording } from "@/src/core/types";
import { useAudioRecording } from "@/src/hooks/useAudioRecording";
import { useRecordingStore } from "@/src/store/useRecordingStore";

/**
 * History Screen
 * Displays child's past recordings and reading history
 * - List of recorded readings with playback
 * - Audio Vault: Saved voice recordings
 */
export default function HistoryScreen(): React.ReactElement {
  const router = useRouter();
  const { recordings, removeRecording } = useRecordingStore();
  const { playbackRecording } = useAudioRecording();

  const sortedRecordings = useMemo<Recording[]>(() => {
    return [...recordings].sort(
      (left, right) =>
        new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
    );
  }, [recordings]);

  const handleDelete = (recordingId: string): void => {
    Alert.alert("Xóa bản ghi", "Bạn muốn xóa bản ghi này chứ?", [
      { text: "Hủy", style: "cancel" },
      { text: "Xóa", style: "destructive", onPress: () => removeRecording(recordingId) },
    ]);
  };

  return (
    <YStack flex={1} backgroundColor={COLORS.cream} padding="$4" gap="$4">
      <XStack justifyContent="space-between" alignItems="center">
        <Text
          fontSize="$7"
          fontWeight="bold"
          accessibilityRole="header"
          accessibilityLabel="Reading History"
        >
          🎙️ Kho ghi âm
        </Text>
        <Text
          onPress={() => router.replace("/(auth)/role-selection")}
          padding="$2"
          color={COLORS.blue}
          fontWeight="700"
          accessible
          accessibilityRole="button"
          accessibilityLabel="Quay lại chọn vai trò"
        >
          Đổi vai trò
        </Text>
      </XStack>

      <FlatList
        data={sortedRecordings}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <YStack height="$3" />}
        renderItem={({ item }) => (
          <RecordingTile
            recording={item}
            onPlay={async (recording) => {
              await playbackRecording(recording.filePath);
            }}
            onDelete={handleDelete}
          />
        )}
        ListEmptyComponent={
          <YStack paddingVertical="$8" alignItems="center">
            <Text color={COLORS.textMuted}>
              Chưa có ghi âm nào. Hãy bắt đầu đọc sách!
            </Text>
          </YStack>
        }
        showsVerticalScrollIndicator={false}
      />
    </YStack>
  );
}
