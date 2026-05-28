import { Mic, Pause, Play, SkipBack } from "lucide-react-native";
import React from "react";
import { Text, XStack, YStack } from "tamagui";
import { Button } from "../shared/Button";

interface ReadingControlsProps {
  isPlaying: boolean;
  isRecording: boolean;
  speed: number;
  onPlay: () => void;
  onPause: () => void;
  onRecord: () => void;
  onReset: () => void;
  onSpeedSelect: (speed: number) => void;
}

const SPEED_OPTIONS: number[] = [0.5, 0.75, 1, 1.25, 1.5];

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
          accessibilityLabel="Quay về đầu bài"
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
          uiVariant="success"
          accessible
          accessibilityRole="button"
          accessibilityLabel={isPlaying ? "Tạm dừng đọc" : "Bắt đầu đọc"}
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
          uiVariant={isRecording ? "danger" : "warning"}
          accessible
          accessibilityRole="button"
          accessibilityLabel={isRecording ? "Đang ghi âm" : "Bắt đầu ghi âm"}
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
              accessibilityLabel={`Đặt tốc độ ${option}`}
              accessibilityState={{ selected: speed === option }}
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
