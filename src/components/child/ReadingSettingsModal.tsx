import { Speed, useReadingStore } from "@/src/store/useReadingStore";
import React from "react";
import { Button, Label, Sheet, Text, XStack, YStack } from "tamagui";

interface ReadingSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ReadingSettingsModal = ({
  open,
  onOpenChange,
}: ReadingSettingsModalProps): React.ReactElement => {
  const { speed, setSpeed } = useReadingStore();

  const speedOptions: Speed[] = [0.5, 0.75, 1, 1.25, 1.5];

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      snapPointsMode="fit"
      dismissOnSnapToBottom
      position={0}
      animation="medium"
    >
      {/* 1. Remove backdrop background by setting it to transparent */}
      <Sheet.Overlay
        backgroundColor="transparent"
        animation="lazy"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />

      {/* 2. Make frame transparent so we can use a floating island look */}
      <Sheet.Frame backgroundColor="transparent">
        <Sheet.Handle />

        {/* 3. Floating Island content container */}
        <YStack
          backgroundColor="$background"
          padding="$5"
          borderRadius="$6"
          gap="$4"
          elevate
          shadowColor="rgba(0,0,0,0.1)"
          shadowRadius={20}
          borderWidth={1}
          borderColor="$border"
        >
          <Text fontSize="$5" fontWeight="800" color="$foreground">
            Cài đặt đọc sách
          </Text>

          <YStack gap="$3">
            <Label fontWeight="700" fontSize="$3" color="$mutedForeground">
              Tốc độ Spotlight
            </Label>
            <XStack alignItems="center" gap="$4">
              <XStack flex={1} gap="$2" justifyContent="space-around">
                {speedOptions.map((option) => (
                  <Button
                    key={option}
                    size="$3"
                    backgroundColor={speed === option ? "$primary" : "$color3"}
                    color={speed === option ? "white" : "$foreground"}
                    onPress={() => setSpeed(option)}
                    borderWidth={0}
                  >
                    {option}x
                  </Button>
                ))}
              </XStack>
            </XStack>
          </YStack>

          <Button
            theme="active"
            size="$4"
            onPress={() => onOpenChange(false)}
            marginTop="$2"
            borderRadius="$4"
            fontWeight="700"
          >
            Đóng
          </Button>
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
};
