import { Button } from "@/src/components/shared/Button";
import { BlurView } from "expo-blur";
import { Mic, Pause, Play, RotateCcw, Volume2 } from "lucide-react-native";
import React from "react";
import { Platform, View } from "react-native";

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
    <View style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
      <Container
        {...(Platform.OS === "ios"
          ? { intensity: 80, tint: "light" }
          : {
              style: { backgroundColor: "rgba(255,255,255,0.8)" },
            })}
        style={{
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          overflow: "hidden",
          borderTopWidth: 1,
          borderTopColor: "rgba(255,255,255,0.5)",
        }}
      >
        <View
          style={{
            paddingHorizontal: 32,
            justifyContent: "space-around",
            alignItems: "center",
            height: 90,
            flexDirection: "row",
          }}
        >
          {/* TTS Toggle */}
          <Button
            uiVariant={isTtsEnabled ? "primary" : "ghost"}
            circular
            size="sm"
            icon={<Volume2 color={isTtsEnabled ? "white" : "#666"} size={22} />}
            onPress={onToggleTts}
            className=""
          />

          {/* Central Button: Play / Pause / Repeat */}
          <Button
            circular
            size="lg"
            uiVariant="primary"
            icon={
              isFinished ? (
                <RotateCcw size={24} color="white" />
              ) : isPlaying ? (
                <Pause size={24} color="white" />
              ) : (
                <Play size={24} color="white" />
              )
            }
            onPress={isFinished ? onRepeat : onTogglePlay}
            className=""
          />

          {/* Record Button */}
          <View style={{ alignItems: "center", position: "relative" }}>
            <Button
              circular
              size="sm"
              uiVariant={isRecording ? "danger" : "ghost"}
              icon={<Mic color={isRecording ? "white" : "#666"} size={22} />}
              onPress={onToggleRecording}
            />
            {isRecording && (
              <View
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: "#D32F2F",
                  position: "absolute",
                  top: -2,
                  right: -2,
                  borderWidth: 2,
                  borderColor: "white",
                }}
              />
            )}
          </View>
        </View>
      </Container>
    </View>
  );
};
