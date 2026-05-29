import { Button } from "@/src/components/shared/Button";
import { Dialog, DialogContent } from "@/src/components/ui/dialog";
import { Text } from "@/src/components/ui/text";
import { fetchAndComputeMetering } from "@/src/utils/audioProcessing";
import { formatDuration } from "@/src/utils/textProcessing";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import {
    Pause,
    Play,
    SkipBack,
    SkipForward,
    Trash2,
    X,
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import { LayoutChangeEvent, Platform, Pressable, View } from "react-native";

const AudioWaveform =
  Platform.OS === "web"
    ? // eslint-disable-next-line @typescript-eslint/no-require-imports
      require("./AudioWaveform.web").AudioWaveform
    : // eslint-disable-next-line @typescript-eslint/no-require-imports
      require("./AudioWaveform.native").AudioWaveform;

const hasUsefulMetering = (values: number[] | undefined): boolean => {
  if (!values || values.length === 0) return false;
  return values.some((value) => Number.isFinite(value) && value > -159);
};

interface AudioPlaybackModalProps {
  uri: string | null;
  title: string;
  meteringData?: number[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete?: () => void; // Thêm callback để xóa file từ modal
}

export const AudioPlaybackModal = ({
  uri,
  title,
  meteringData = [],
  open,
  onOpenChange,
  onDelete,
}: AudioPlaybackModalProps): React.ReactElement => {
  const player = useAudioPlayer(uri);
  const status = useAudioPlayerStatus(player);
  const [speed, setSpeed] = useState(1.0);
  const [localMetering, setLocalMetering] = useState<number[] | undefined>(
    undefined,
  );

  const handleTogglePlay = () => {
    if (status.playing) {
      player.pause();
    } else {
      player.play();
    }
  };

  const handleSeek = (value: number[]) => {
    player.seekTo(value[0]);
  };

  const handleSkip = (seconds: number) => {
    const nextTime = Math.min(
      Math.max(0, status.currentTime + seconds),
      status.duration,
    );
    player.seekTo(nextTime);
  };

  const handleToggleSpeed = () => {
    const nextSpeed =
      speed === 1.0 ? 1.25 : speed === 1.25 ? 1.5 : speed === 1.5 ? 0.75 : 1.0;
    setSpeed(nextSpeed);
    player.playbackRate = nextSpeed;
  };

  useEffect(() => {
    if (open && uri) {
      player.replace(uri);

      // If on web and no metering provided, compute from audio blob
      if (Platform.OS === "web" && !hasUsefulMetering(meteringData)) {
        (async () => {
          const computed = await fetchAndComputeMetering(uri as string, 120);
          if (computed && computed.length > 0) setLocalMetering(computed);
        })();
      }
    } else {
      player.pause();
    }
  }, [open, uri, player, meteringData]);

  const progress =
    status.duration > 0 ? status.currentTime / status.duration : 0;

  console.log("Rendering AudioPlaybackModal with status:", status);
  console.log(
    "Metering data length:",
    meteringData.length,
    "Local metering length:",
    localMetering?.length,
  );
  console.log(meteringData, localMetering);

  if (!open && !uri) {
    return <></>;
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <View style={{ maxWidth: 450, alignSelf: "center", padding: 16 }}>
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View style={{ flex: 1 }}>
              <Text className="text-sm text-primary font-semibold">
                Đang phát bản ghi
              </Text>
              <Text className="text-xl font-black" numberOfLines={1}>
                {title}
              </Text>
            </View>
            <Button
              uiVariant="ghost"
              circular
              icon={<X size={20} />}
              onPress={() => onOpenChange(false)}
            />
          </View>

          {/* Waveform */}
          <View
            style={{
              height: 80,
              alignItems: "center",
              justifyContent: "center",
              marginTop: 12,
            }}
          >
            <AudioWaveform
              meteringData={
                hasUsefulMetering(localMetering) ? localMetering : meteringData
              }
              progress={progress}
              height={80}
            />
          </View>

          {/* Custom progress bar */}
          <View style={{ marginTop: 12 }}>
            <ProgressBar
              progress={progress}
              duration={status.duration || 1}
              onSeek={(time) => handleSeek([time])}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 6,
              }}
            >
              <Text className="text-sm text-muted-foreground">
                {formatDuration(status.currentTime * 1000)}
              </Text>
              <Text className="text-sm text-muted-foreground">
                {formatDuration((status.duration || 0) * 1000)}
              </Text>
            </View>
          </View>

          {/* Controls */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 20,
              marginTop: 12,
            }}
          >
            <Button
              uiVariant="ghost"
              circular
              icon={<SkipBack size={22} />}
              onPress={() => handleSkip(-10)}
            />

            <Button
              uiVariant="primary"
              circular
              size="lg"
              icon={
                status.playing ? (
                  <Pause size={32} color="white" />
                ) : (
                  <Play size={32} color="white" />
                )
              }
              onPress={handleTogglePlay}
            />

            <Button
              uiVariant="ghost"
              circular
              icon={<SkipForward size={22} />}
              onPress={() => handleSkip(10)}
            />
          </View>

          <View
            style={{
              height: 1,
              backgroundColor: "#E6E7E9",
              marginVertical: 12,
            }}
          />

          {/* Footer Actions */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Button uiVariant="outline" size="sm" onPress={handleToggleSpeed}>
              Tốc độ: {speed}x
            </Button>

            {onDelete && (
              <Button
                uiVariant="ghost"
                size="sm"
                icon={<Trash2 size={18} color="#D32F2F" />}
                onPress={() => {
                  onOpenChange(false);
                  onDelete();
                }}
              >
                Xóa
              </Button>
            )}
          </View>
        </View>
      </DialogContent>
    </Dialog>
  );
};

function ProgressBar({
  progress,
  duration,
  onSeek,
}: {
  progress: number;
  duration: number;
  onSeek: (time: number) => void;
}) {
  const [width, setWidth] = useState(0);
  const ref = useRef<View | null>(null);

  const handleLayout = (e: LayoutChangeEvent) => {
    setWidth(e.nativeEvent.layout.width);
  };

  const handlePress = (e: any) => {
    const x = e.nativeEvent.locationX;
    if (width > 0) {
      const t = Math.max(0, Math.min(1, x / width)) * duration;
      onSeek(t);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      onLayout={handleLayout}
      ref={ref as any}
      style={{ height: 24, justifyContent: "center" }}
    >
      <View
        style={{
          height: 6,
          backgroundColor: "#F1F5F9",
          borderRadius: 6,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            height: "100%",
            width: `${Math.min(100, Math.max(0, progress * 100))}%`,
            backgroundColor: "#0EA5E9",
          }}
        />
      </View>
    </Pressable>
  );
}
