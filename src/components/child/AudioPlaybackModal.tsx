import { Button } from "@/src/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/src/components/ui/dialog";
import { Progress } from "@/src/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  type Option,
} from "@/src/components/ui/select";
import { Text } from "@/src/components/ui/text";
import { formatDuration } from "@/src/utils/textProcessing";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Platform, View } from "react-native";
import { Icon } from "../ui/icon";

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
}

const EMPTY_METERING: number[] = [];

export const AudioPlaybackModal = ({
  uri,
  title,
  meteringData = EMPTY_METERING,
  open,
  onOpenChange,
}: AudioPlaybackModalProps): React.ReactElement => {
  const SPEED_OPTIONS = [0.75, 1, 1.25, 1.5];

  const player = useAudioPlayer(uri);
  const status = useAudioPlayerStatus(player);
  const [speed, setSpeed] = useState(1.0);

  const handleTogglePlay = () => {
    if (status.playing) {
      player.pause();
    } else {
      player.play();
    }
  };

  const handleSeek = (value: number[]) => {
    const nextTime = value[0];
    if (!Number.isFinite(nextTime)) return;
    player.seekTo(nextTime);
  };

  const currentSpeedOption: Option = {
    value: String(speed),
    label: `${speed}x`,
  };

  const handleSpeedChange = (nextOption: Option) => {
    if (!nextOption) return;

    const nextSpeed = Number(nextOption.value);
    if (!Number.isFinite(nextSpeed)) return;
    setSpeed(nextSpeed);
    player.playbackRate = nextSpeed;
  };

  const handleSkip = (seconds: number) => {
    const currentTime = Number.isFinite(status.currentTime)
      ? status.currentTime
      : 0;
    const duration = Number.isFinite(status.duration) ? status.duration : 0;
    const nextTime = Math.min(Math.max(0, currentTime + seconds), duration);
    if (!Number.isFinite(nextTime)) return;
    player.seekTo(nextTime);
  };

  // Pause when closing or unmounting
  useEffect(() => {
    try {
      if (!open) {
        player.pause();
      }
    } catch (e) {
      // Ignore
    }

    return () => {
      // Critical: Ensure audio stops when component is unmounted
      try {
        player.pause();
      } catch (e) {
        // Already released
      }
    };
  }, [open, player]);

  const progress =
    Number.isFinite(status.duration) &&
    status.duration > 0 &&
    Number.isFinite(status.currentTime)
      ? Math.min(Math.max(status.currentTime / status.duration, 0), 1)
      : 0;

  const currentDuration = Number.isFinite(status.currentTime)
    ? status.currentTime
    : 0;
  const totalDuration = Number.isFinite(status.duration) ? status.duration : 0;
  const progressValue = Math.round(progress * 100);

  if (!open && !uri) {
    return <></>;
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full min-w-[280px] lg:max-w-[520px] max-w-[calc(100vw-1rem)]">
        <View className="w-full gap-4 self-center">
          <DialogTitle className="mb-0 p-0">
            <Text
              className="text-xl font-extrabold leading-tight"
              numberOfLines={2}
            >
              {title}
            </Text>
          </DialogTitle>

          <View className="rounded-3xl border border-border bg-card p-4 shadow-sm">
            {/* <View className="items-center justify-center rounded-2xl bg-muted/50 px-3 py-4">
              <AudioWaveform
                meteringData={
                  hasUsefulMetering(localMetering)
                    ? localMetering
                    : meteringData
                }
                progress={progress}
                height={76}
              />
            </View> */}

            <View className="mt-4 gap-2">
              <Progress
                value={progressValue}
                className="h-2 w-full"
                indicatorClassName="bg-primary"
              />
              <View className="flex-row justify-between mt-1">
                <Text className="text-xs text-muted-foreground">
                  {formatDuration(currentDuration * 1000)}
                </Text>
                <Text className="text-xs text-muted-foreground">
                  {formatDuration(totalDuration * 1000)}
                </Text>
              </View>
            </View>

            <View className="mt-4 flex-row items-center justify-between gap-3">
              <Button
                variant="outline"
                size="icon"
                onPress={() => handleSkip(-10)}
              >
                <Icon as={SkipBack} className="size-4 text-foreground" />
              </Button>

              <Button variant="default" size="icon" onPress={handleTogglePlay}>
                {status.playing ? (
                  <Icon as={Pause} className="size-4 text-primary-foreground" />
                ) : (
                  <Icon as={Play} className="size-4 text-primary-foreground" />
                )}
              </Button>

              <Button
                variant="outline"
                size="icon"
                onPress={() => handleSkip(10)}
              >
                <Icon as={SkipForward} className="size-4 text-foreground" />
              </Button>

              <Select
                value={currentSpeedOption}
                onValueChange={handleSpeedChange}
              >
                <SelectTrigger className="h-11 min-w-[84px] rounded-full px-4">
                  <SelectValue
                    placeholder="Tốc độ"
                    className="text-xs font-semibold"
                  />
                </SelectTrigger>
                <SelectContent>
                  {SPEED_OPTIONS.map((option) => (
                    <SelectItem
                      key={option}
                      value={String(option)}
                      label={`${option}x`}
                    >
                      {option}x
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </View>

            <Button
              className="mt-6 w-full rounded-2xl"
              onPress={() => onOpenChange(false)}
            >
              <Text className="text-primary-foreground font-bold">
                Hoàn tất
              </Text>
            </Button>
          </View>
        </View>
      </DialogContent>
    </Dialog>
  );
};
