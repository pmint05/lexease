import { Mic, Pause, Play, SkipBack } from "lucide-react-native";
import React from "react";
import { Button, Text, XStack, YStack } from "tamagui";

import { COLORS } from "@/src/core/constants/colors";
import { ReadingRate } from "@/src/core/types";

interface ReadingControlsProps {
  isPlaying: boolean;
  isRecording: boolean;
  speed: ReadingRate;
  onPlay: () => void;
  onPause: () => void;
  onRecord: () => void;
  onReset: () => void;
  onSpeedSelect: (speed: ReadingRate) => void;
}

const SPEED_OPTIONS: ReadingRate[] = [0.5, 0.75, 1, 1.25, 1.5];

export const ReadingControls = ({
  isPlaying,
  isRecording,
  speed,
  onPlay,
  onPause,
  onRecord,
  onReset,
  onSpeedSelect,
}: ReadingControlsProps): React.ReactElement => {
  return (
    <YStack gap="$3">
      <XStack gap="$2" flexWrap="wrap" justifyContent="center">
        <Button
          size="$5"
          onPress={onReset}
          icon={<SkipBack color={COLORS.textDark} size={20} />}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Quay về đầu bài"
        >
          Đầu
        </Button>

        <Button
          size="$5"
          onPress={isPlaying ? onPause : onPlay}
          icon={isPlaying ? <Pause color={COLORS.textDark} size={20} /> : <Play color={COLORS.textDark} size={20} />}
          backgroundColor={COLORS.green}
          accessible
          accessibilityRole="button"
          accessibilityLabel={isPlaying ? "Tạm dừng đọc" : "Bắt đầu đọc"}
        >
          {isPlaying ? "Dừng" : "Đọc"}
        </Button>

        <Button
          size="$5"
          onPress={onRecord}
          icon={<Mic color={COLORS.textDark} size={20} />}
          backgroundColor={isRecording ? COLORS.red : COLORS.orange}
          accessible
          accessibilityRole="button"
          accessibilityLabel={isRecording ? "Đang ghi âm" : "Bắt đầu ghi âm"}
        >
          {isRecording ? "Ghi" : "Thu"}
        </Button>

      </XStack>

      <YStack gap="$2" alignItems="center">
        <Text fontSize="$3" color={COLORS.textMuted}>
          Tốc độ đọc
        </Text>
        <XStack gap="$2" flexWrap="wrap" justifyContent="center">
          {SPEED_OPTIONS.map((option) => (
            <Button
              key={option}
              size="$3"
              onPress={() => onSpeedSelect(option)}
              backgroundColor={speed === option ? COLORS.blue : "$background"}
              borderWidth={1}
              borderColor={speed === option ? COLORS.blue : "$color5"}
              accessible
              accessibilityRole="button"
              accessibilityLabel={`Đặt tốc độ ${option}`}
              accessibilityState={{ selected: speed === option }}
            >
              <Text color={speed === option ? "white" : COLORS.textDark}>
                {option}x
              </Text>
            </Button>
          ))}
        </XStack>
      </YStack>
    </YStack>
  );
};
