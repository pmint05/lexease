import { Trash2, Volume2 } from "lucide-react-native";
import React from "react";
import { Button, Card, Text, XStack, YStack } from "tamagui";

import { Recording } from "@/src/core/types";
import { formatDate, formatReadingTime } from "@/src/utils/formatters";

interface RecordingTileProps {
  recording: Recording;
  onPlay: (recording: Recording) => void;
  onDelete: (recordingId: string) => void;
}

export const RecordingTile = ({ recording, onPlay, onDelete }: RecordingTileProps): React.ReactElement => {
  return (
    <Card padding="$4" borderWidth={1} borderColor="$border" backgroundColor="$background">
      <YStack gap="$2">
        <Text fontSize="$5" fontWeight="700" color="$foreground">
          {recording.bookTitle}
        </Text>
        <Text color="$mutedForeground">{formatDate(recording.createdAt)}</Text>
        <Text color="$mutedForeground">{formatReadingTime(recording.durationMs)}</Text>

        <XStack gap="$2" justifyContent="flex-end">
          <Button
            size="$3"
            onPress={() => onPlay(recording)}
            icon={<Volume2 color="$foreground" size={16} />}
            accessible
            accessibilityRole="button"
            accessibilityLabel={`Phát bản ghi của ${recording.bookTitle}`}
          >
            Nghe
          </Button>
          <Button
            size="$3"
            onPress={() => onDelete(recording.id)}
            icon={<Trash2 color="$primaryForeground" size={16} />}
            backgroundColor="$destructive"
            color="$primaryForeground"
            accessible
            accessibilityRole="button"
            accessibilityLabel={`Xóa bản ghi của ${recording.bookTitle}`}
          >
            Xóa
          </Button>
        </XStack>
      </YStack>
    </Card>
  );
};
