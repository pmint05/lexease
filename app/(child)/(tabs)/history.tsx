import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { Alert, FlatList } from "react-native";
import { Text, XStack, YStack } from "tamagui";

import { RecordingTile } from "@/src/components/child/RecordingTile";
import { Recording } from "@/src/core/types";
import { useAudioRecording } from "@/src/hooks/useAudioRecording";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useRecordingStore } from "@/src/store/useRecordingStore";

/**
 * History Screen
 * Displays child's past recordings and reading history
 * - List of recorded readings with playback
 * - Audio Vault: Saved voice recordings
 */
export default function HistoryScreen(): React.ReactElement {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { recordings, removeRecording } = useRecordingStore();
  const { playbackRecording } = useAudioRecording();

  const sortedRecordings = useMemo<Recording[]>(() => {
    return recordings
      .filter((recording) => recording.childId === user?.id)
      .sort(
      (left, right) =>
        new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
    );
  }, [recordings, user?.id]);

  const handleDelete = (recordingId: string): void => {
    Alert.alert("Xóa bản ghi", "Bạn muốn xóa bản ghi này chứ?", [
      { text: "Hủy", style: "cancel" },
      { text: "Xóa", style: "destructive", onPress: () => removeRecording(recordingId) },
    ]);
  };

  return (
    <YStack flex={1} backgroundColor="$background" paddingHorizontal="$4" gap="$4">
      <FlatList
        data={sortedRecordings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: 16 }}
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
            <Text color="$mutedForeground">
              Chưa có ghi âm nào. Hãy bắt đầu đọc sách!
            </Text>
          </YStack>
        }
        showsVerticalScrollIndicator={false}
      />
    </YStack>
  );
}
