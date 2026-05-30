import { cn } from "@/src/lib/utils";
import { BlurView } from "expo-blur";
import { Mic, Pause, Play, RotateCcw, Volume2 } from "lucide-react-native";
import React from "react";
import { Platform, View } from "react-native";
import { Button } from "../ui/button";

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
          borderTopColor: "rgba(255,255,255,0.1)",
        }}
        className="bg-card"
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
            variant={isTtsEnabled ? "default" : "ghost"}
            size="icon"
            onPress={onToggleTts}
          >
            <Volume2
              className={cn(
                "text-foreground size-5",
                isTtsEnabled && "text-white",
              )}
              size={22}
            />
          </Button>

          {/* Central Button: Play / Pause / Repeat */}
          <Button
            size="icon"
            variant="default"
            onPress={isFinished ? onRepeat : onTogglePlay}
            className="size-14 rounded-full"
          >
            {isFinished ? (
              <RotateCcw className="text-foreground size-6" />
            ) : isPlaying ? (
              <Pause className="text-foreground size-6" />
            ) : (
              <Play className="text-foreground size-6" />
            )}
          </Button>

          {/* Record Button */}
          <View style={{ alignItems: "center", position: "relative" }}>
            <Button
              size="icon"
              variant={isRecording ? "destructive" : "ghost"}
              onPress={onToggleRecording}
            >
              <Mic
                className={cn(
                  "text-foreground size-5",
                  isRecording && "text-white",
                )}
              />
            </Button>
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
