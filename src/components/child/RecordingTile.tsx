import { Mic, Play, Trash2 } from "lucide-react-native";
import React, { useState } from "react";
import { Button, Circle, Popover, Text, XStack, YStack } from "tamagui";

import { Recording } from "@/src/core/types";
import { formatDateTime, formatReadingTime } from "@/src/utils/formatters";

interface RecordingTileProps {
  recording: Recording;
  showTitle?: boolean; // Hiển thị tên sách nếu cần (ví dụ trong trang Lịch sử)
  onPlay: (recording: Recording) => void;
  onDelete: (recordingId: string) => void;
}

export const RecordingTile = ({
  recording,
  showTitle = false,
  onPlay,
  onDelete,
}: RecordingTileProps): React.ReactElement => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover
      open={isOpen}
      onOpenChange={setIsOpen}
      placement="bottom"
      size="$4"
    >
      <Popover.Trigger asChild>
        <XStack
          padding="$3"
          backgroundColor="$color2"
          borderRadius="$4"
          alignItems="center"
          gap="$3"
          onLongPress={() => setIsOpen(true)}
          pressStyle={{ backgroundColor: "$color3" }}
        >
          {/* Icon indicator */}
          <Circle size={44} backgroundColor="$primaryForeground">
            <Mic size={22} />
          </Circle>

          <YStack flex={1} gap="$0.5">
            {showTitle && (
              <Text
                fontSize="$4"
                fontWeight="700"
                color="$foreground"
                numberOfLines={1}
              >
                {recording.bookTitle}
              </Text>
            )}
            <Text
              fontSize="$3"
              fontWeight={showTitle ? "500" : "700"}
              color={showTitle ? "$mutedForeground" : "$foreground"}
            >
              Bản ghi: {formatDateTime(recording.createdAt)}
            </Text>
            <Text fontSize="$2" color="$mutedForeground">
              Thời lượng: {formatReadingTime(recording.durationMs)}
            </Text>
          </YStack>

          <Button
            size="$4"
            circular
            backgroundColor="$background"
            bordered
            borderColor="$border"
            icon={
              <Play size={20} fill="$primary" color="$primary" marginLeft={2} />
            }
            onPress={() => onPlay(recording)}
            pressStyle={{ backgroundColor: "$color4" }}
            elevate
          />
        </XStack>
      </Popover.Trigger>

      <Popover.Content
        borderWidth={1}
        borderColor="$border"
        enterStyle={{ y: -10, opacity: 0 }}
        exitStyle={{ y: -10, opacity: 0 }}
        elevate
        animation={[
          "quick",
          {
            opacity: {
              overshootClamping: true,
            },
          },
        ]}
        padding="$2"
        backgroundColor="$background"
      >
        <YStack width={180}>
          <Button
            chromeless
            justifyContent="flex-start"
            icon={<Trash2 size={18} color="$destructive" />}
            onPress={() => {
              setIsOpen(false);
              onDelete(recording.id);
            }}
            color="$destructive"
            fontWeight="700"
            fontSize="$3"
          >
            Xóa bản ghi này
          </Button>
        </YStack>
      </Popover.Content>
    </Popover>
  );
};
