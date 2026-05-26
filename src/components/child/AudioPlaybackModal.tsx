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
import React, { useEffect, useState } from "react";
import { Platform } from "react-native";
import {
    Button,
    Separator,
    Sheet,
    Slider,
    Text,
    XStack,
    YStack,
} from "tamagui";

const AudioWaveform =
  Platform.OS === "web"
    ? require("./AudioWaveform.web").AudioWaveform
    : require("./AudioWaveform.native").AudioWaveform;

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
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      snapPointsMode="fit"
      dismissOnSnapToBottom
      position={0}
      modal
    >
      <Sheet.Overlay
        backgroundColor="rgba(0,0,0,0.5)"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />

      <Sheet.Frame backgroundColor="transparent" paddingBottom={"$2"}>
        <Sheet.Handle marginBottom="$4" />

        <YStack
          backgroundColor="$background"
          padding="$6"
          borderRadius="$6"
          gap="$6"
          shadowColor="rgba(0,0,0,0.1)"
          shadowRadius={30}
          maxWidth={450} // Kích thước tối ưu cho mobile
          alignSelf="center"
        >
          {/* Header */}
          <XStack justifyContent="space-between" alignItems="center">
            <YStack flex={1} gap="$1">
              <Text
                fontSize="$2"
                color="$primary"
                fontWeight="700"
                textTransform="uppercase"
                letterSpacing={1}
              >
                Đang phát bản ghi
              </Text>
              <Text fontSize="$5" fontWeight="900" numberOfLines={1}>
                {title}
              </Text>
            </YStack>
            <Button
              circular
              size="$3"
              chromeless
              icon={<X size={20} />}
              onPress={() => onOpenChange(false)}
            />
          </XStack>

          {/* Real Audio Waveform */}
          <YStack
            height={80}
            alignItems="center"
            justifyContent="center"
            width="100%"
          >
            <AudioWaveform
              meteringData={
                hasUsefulMetering(localMetering) ? localMetering : meteringData
              }
              progress={progress}
              height={80}
            />
          </YStack>

          {/* Progress Slider */}
          <YStack gap="$2">
            <Slider
              value={[status.currentTime]}
              max={status.duration || 1}
              step={0.01}
              onValueChange={handleSeek}
            >
              <Slider.Track backgroundColor="$color4">
                <Slider.TrackActive backgroundColor="$primary" />
              </Slider.Track>
              <Slider.Thumb
                index={0}
                circular
                backgroundColor="white"
                size="$1"
                borderWidth={1}
                borderColor="$border"
              />
            </Slider>
            <XStack justifyContent="space-between">
              <Text fontSize="$1" fontWeight="600" color="$mutedForeground">
                {formatDuration(status.currentTime * 1000)}
              </Text>
              <Text fontSize="$1" fontWeight="600" color="$mutedForeground">
                {formatDuration(status.duration * 1000)}
              </Text>
            </XStack>
          </YStack>

          {/* Controls */}
          <XStack justifyContent="center" alignItems="center" gap="$5">
            <Button
              circular
              size="$4"
              chromeless
              icon={<SkipBack size={22} fill="currentColor" />}
              onPress={() => handleSkip(-10)}
            />

            <Button
              circular
              size="$7"
              backgroundColor="$primary"
              icon={
                status.playing ? (
                  <Pause size={32} fill="white" color="white" />
                ) : (
                  <Play size={32} fill="white" color="white" />
                )
              }
              onPress={handleTogglePlay}
              shadowColor="$primary"
              shadowRadius={15}
              shadowOpacity={0.3}
            />

            <Button
              circular
              size="$4"
              chromeless
              icon={<SkipForward size={22} fill="currentColor" />}
              onPress={() => handleSkip(10)}
            />
          </XStack>

          <Separator backgroundColor="$border" />

          {/* Footer Actions */}
          <XStack justifyContent="space-between" alignItems="center">
            <Button
              size="$3"
              variant="outlined"
              borderRadius="$10"
              onPress={handleToggleSpeed}
              minWidth={100}
            >
              Tốc độ: {speed}x
            </Button>

            {onDelete && (
              <Button
                size="$3"
                chromeless
                icon={<Trash2 size={18} color="$destructive" />}
                onPress={() => {
                  onOpenChange(false);
                  onDelete();
                }}
              >
                Xóa
              </Button>
            )}
          </XStack>
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
};
