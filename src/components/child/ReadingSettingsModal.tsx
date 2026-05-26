import { useReadingStore } from "@/src/store/useReadingStore";
import { Minus, Plus } from "lucide-react-native";
import React from "react";
import { Label, Sheet, Text, XStack, YStack } from "tamagui";
import { Button } from "../shared/Button";

interface ReadingSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ReadingSettingsModal = ({
  open,
  onOpenChange,
}: ReadingSettingsModalProps): React.ReactElement => {
  const { speed, setSpeed } = useReadingStore();

  const handleIncrement = () => {
    if (speed < 2.0) {
      setSpeed(Math.round((speed + 0.1) * 10) / 10);
    }
  };

  const handleDecrement = () => {
    if (speed > 0.5) {
      setSpeed(Math.round((speed - 0.1) * 10) / 10);
    }
  };

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      snapPointsMode="fit"
      dismissOnSnapToBottom
      position={0}
    >
      <Sheet.Overlay
        backgroundColor="transparent"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />

      <Sheet.Frame backgroundColor="transparent">
        <Sheet.Handle />

        <YStack
          backgroundColor="$background"
          padding="$6"
          borderRadius="$6"
          gap="$6"
          shadowColor="rgba(0,0,0,0.1)"
          shadowRadius={30}
          borderWidth={1}
          borderColor="$border"
        >
          <YStack gap="$1">
            <Text fontSize="$6" fontWeight="900" color="$foreground">
              Cài đặt
            </Text>
            <Text fontSize="$3" color="$mutedForeground">
              Điều chỉnh nhịp độ phù hợp với bé
            </Text>
          </YStack>

          <YStack gap="$4">
            <Label fontWeight="700" fontSize="$4">
              Tốc độ Spotlight
            </Label>

            <XStack alignItems="center" justifyContent="center" gap="$6">
              <Button
                uiVariant="outline"
                circular
                size="$5"
                backgroundColor="$color3"
                icon={<Minus size={24} />}
                onPress={handleDecrement}
                disabled={speed <= 0.5}
                opacity={speed <= 0.5 ? 0.3 : 1}
              />

              <YStack alignItems="center" width={100}>
                <Text fontSize="$8" fontWeight="900" color="$primary">
                  {speed.toFixed(1)}x
                </Text>
                <XStack gap="$1" marginTop="$1" alignItems="center">
                  <Text
                    fontSize="$1"
                    fontWeight="700"
                    color="$mutedForeground"
                    textTransform="uppercase"
                  >
                    {speed <= 0.8 ? "Chậm" : speed >= 1.5 ? "Nhanh" : "Vừa"}
                  </Text>
                </XStack>
              </YStack>

              <Button
                uiVariant="outline"
                circular
                size="$5"
                backgroundColor="$color3"
                icon={<Plus size={24} />}
                onPress={handleIncrement}
                disabled={speed >= 2.0}
                opacity={speed >= 2.0 ? 0.3 : 1}
              />
            </XStack>
          </YStack>

          <Button
            size="$5"
            onPress={() => onOpenChange(false)}
            marginTop="$2"
            borderRadius="$4"
          >
            Hoàn tất
          </Button>
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
};
