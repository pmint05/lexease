import { ChevronLeft, Settings } from "lucide-react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Text, XStack, YStack } from "tamagui";

interface ReadingHeaderProps {
  title: string;
  progress: number; // 0 to 100
  onBack: () => void;
  onOpenSettings: () => void;
}

export const ReadingHeader = ({
  title,
  progress,
  onBack,
  onOpenSettings,
}: ReadingHeaderProps): React.ReactElement => {
  const insets = useSafeAreaInsets();

  return (
    <YStack paddingTop={insets.top} backgroundColor="$background">
      <XStack
        paddingHorizontal="$4"
        paddingVertical="$2"
        alignItems="center"
        justifyContent="space-between"
      >
        <XStack flex={1} alignItems="center" gap="$2">
          <Button
            icon={<ChevronLeft size={24} />}
            chromeless
            onPress={onBack}
            padding={0}
            width={40}
          />
          <Text
            fontSize="$5"
            fontWeight="700"
            numberOfLines={1}
            flex={1}
            textAlign="left"
          >
            {title}
          </Text>
        </XStack>

        <Button
          icon={<Settings size={22} />}
          chromeless
          onPress={onOpenSettings}
        />
      </XStack>

      {/* <Progress 
        value={progress} 
        size="$1" 
        borderRadius={0} 
        backgroundColor="$color4"
        height={4}
      >
        <Progress.Indicator 
          backgroundColor="$primary" 
        />
      </Progress> */}
    </YStack>
  );
};
