import { BlurView } from "expo-blur";
import { Mic, Pause, Play, RotateCcw, Volume2 } from "lucide-react-native";
import React from "react";
import { Platform } from "react-native";
import { Button, Circle, View, XStack, YStack } from "tamagui";

interface ReadingBottomBarProps {
  isPlaying: boolean;
  isRecording: boolean;
  isTtsEnabled: boolean;
  isFinished: boolean; // Trạng thái đã đọc hết bài
  onTogglePlay: () => void;
  onToggleRecording: () => void;
  onToggleTts: () => void;
  onRepeat: () => void; // Hàm để đọc lại từ đầu
}

export const ReadingBottomBar = ({
  isPlaying,
  isRecording,
  isTtsEnabled,
  isFinished,
  onTogglePlay,
  onToggleRecording,
  onToggleTts,
  onRepeat,
}: ReadingBottomBarProps): React.ReactElement => {
  const Container = Platform.OS === "ios" ? BlurView : View;

  return (
    <YStack position="absolute" bottom={0} left={0} right={0}>
      <Container
        {...(Platform.OS === "ios"
          ? { intensity: 80, tint: "light" }
          : {
              backgroundColor: "rgba(255, 255, 255, 0.85)",
            })}
        style={{
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          overflow: "hidden",
          borderTopWidth: 1,
          borderTopColor: "rgba(255, 255, 255, 0.5)",
        }}
      >
        <XStack
          paddingHorizontal="$8"
          justifyContent="space-between"
          alignItems="center"
          height={90}
        >
          {/* TTS Toggle */}
          <Button
            circular
            size="$4"
            backgroundColor={isTtsEnabled ? "$primary" : "rgba(0,0,0,0.05)"}
            icon={<Volume2 color={isTtsEnabled ? "white" : "#666"} size={22} />}
            onPress={onToggleTts}
            pressStyle={{ scale: 0.9 }}
            borderWidth={0}
            elevation={2}
          />

          {/* Central Button: Play / Pause / Repeat */}
          <Button
            circular
            size="$5"
            backgroundColor="$primary"
            icon={
              isFinished ? (
                <RotateCcw size={24} color="white" />
              ) : isPlaying ? (
                <Pause size={24} fill="white" color="white" />
              ) : (
                <Play size={24} fill="white" color="white" />
              )
            }
            onPress={isFinished ? onRepeat : onTogglePlay}
            scale={1.2}
            elevate
            pressStyle={{ scale: 1.1 }}
            shadowColor="$primary"
            shadowRadius={15}
            shadowOpacity={0.3}
          />

          {/* Record Button */}
          <YStack alignItems="center" position="relative">
            <Button
              circular
              size="$4"
              backgroundColor={
                isRecording ? "$destructive" : "rgba(0,0,0,0.05)"
              }
              icon={<Mic color={isRecording ? "white" : "#666"} size={22} />}
              onPress={onToggleRecording}
              pressStyle={{ scale: 0.9 }}
              borderWidth={0}
              elevation={2}
            />
            {isRecording && (
              <Circle
                size={12}
                backgroundColor="$destructive"
                position="absolute"
                top={-2}
                right={-2}
                animation="lazy"
                borderWidth={2}
                borderColor="white"
              />
            )}
          </YStack>
        </XStack>
      </Container>
    </YStack>
  );
};
