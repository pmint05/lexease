import { Text } from "@/src/components/ui/text";
import { Mic, Pause, Play, SkipBack } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
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
    <View className="gap-3">
      <View className="flex-row flex-wrap justify-center gap-2">
        <Button
          size="large"
          onPress={onReset}
          icon={<SkipBack color="#000" size={20} />}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Quay về đầu bài"
        >
          Đầu
        </Button>

        <Button
          size="large"
          onPress={isPlaying ? onPause : onPlay}
          icon={
            isPlaying ? (
              <Pause color="#000" size={20} />
            ) : (
              <Play color="#000" size={20} />
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
          size="large"
          onPress={onRecord}
          icon={<Mic color={isRecording ? "#D32F2F" : "#FFC107"} size={20} />}
          uiVariant={isRecording ? "danger" : "warning"}
          accessible
          accessibilityRole="button"
          accessibilityLabel={isRecording ? "Đang ghi âm" : "Bắt đầu ghi âm"}
        >
          {isRecording ? "Dừng" : "Ghi"}
        </Button>
      </View>

      <View className="items-center gap-2">
        <Text className="text-base text-muted-foreground">Tốc độ đọc</Text>
        <View className="flex-row flex-wrap justify-center gap-2">
          {SPEED_OPTIONS.map((option) => (
            <Button
              key={option}
              size="sm"
              onPress={() => onSpeedSelect(option)}
              className={
                option === speed
                  ? "border border-primary"
                  : "border border-border"
              }
              accessible
              accessibilityRole="button"
              accessibilityLabel={`Đặt tốc độ ${option}`}
              accessibilityState={{ selected: speed === option }}
            >
              <Text
                className={
                  option === speed ? "text-primary" : "text-foreground"
                }
              >
                {option}x
              </Text>
            </Button>
          ))}
        </View>
      </View>
    </View>
  );
};
