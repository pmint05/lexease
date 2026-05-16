import { Mic, Pause, Play, SkipBack } from "lucide-react-native";
import React from "react";
import { Button, Text, XStack, YStack } from "tamagui";

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
          icon={<SkipBack color="$foreground" size={20} />}
          accessible
          accessibilityRole="button"
          accessibilitylabel="Quay về đầu bài"
        >
          Đầu
        </Button>

        <Button
          size="$5"
          onPress={isPlaying ? onPause : onPlay}
          icon={
            isPlaying ? (
              <Pause color="$accentForeground" size={20} />
            ) : (
              <Play color="$accentForeground" size={20} />
            )
          }
          backgroundColor="$accent"
          color="$accentForeground"
          accessible
          accessibilityRole="button"
          accessibilitylabel={isPlaying ? "Tạm dừng đọc" : "Bắt đầu đọc"}
        >
          {isPlaying ? "Dừng" : "Đọc"}
        </Button>

        <Button
          size="$5"
          onPress={onRecord}
          icon={
            <Mic
              color={
                isRecording ? "$destructiveForeground" : "$secondaryForeground"
              }
              size={20}
            />
          }
          backgroundColor={isRecording ? "$destructive" : "$secondary"}
          color={
            isRecording ? "$destructiveForeground" : "$secondaryForeground"
          }
          accessible
          accessibilityRole="button"
          accessibilitylabel={isRecording ? "Đang ghi âm" : "Bắt đầu ghi âm"}
        >
          {isRecording ? "Dừng" : "Ghi"}
        </Button>
      </XStack>

      <YStack gap="$2" alignItems="center">
        <Text fontSize="$3" color="$mutedForeground">
          Tốc độ đọc
        </Text>
        <XStack gap="$2" flexWrap="wrap" justifyContent="center">
          {SPEED_OPTIONS.map((option) => (
            <Button
              key={option}
              size="$3"
              onPress={() => onSpeedSelect(option)}
              backgroundColor={speed === option ? "$primary" : "$background"}
              borderWidth={1}
              borderColor={speed === option ? "$primary" : "$border"}
              accessible
              accessibilityRole="button"
              accessibilitylabel={`Đặt tốc độ ${option}`}
              accessibilitystate={{ selected: speed === option }}
            >
              <Text
                color={speed === option ? "$primaryForeground" : "$foreground"}
              >
                {option}x
              </Text>
            </Button>
          ))}
        </XStack>
      </YStack>
    </YStack>
  );
};
