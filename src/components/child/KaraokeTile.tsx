import React from "react";
import { Text, XStack } from "tamagui";

interface KaraokeTileProps {
  word: string;
  isHighlighted: boolean;
}

export const KaraokeTile = ({ word, isHighlighted }: KaraokeTileProps): React.ReactElement => {
  return (
    <XStack
      paddingHorizontal="$2"
      paddingVertical="$1"
      borderRadius="$3"
      backgroundColor={isHighlighted ? "$secondary" : "transparent"}
      accessible
      accessibilityRole="text"
      accessibilitylabel={isHighlighted ? `Từ đang được đọc: ${word}` : word}
    >
      <Text
        fontSize="$6"
        fontWeight={isHighlighted ? "700" : "400"}
        color="$foreground"
        letterSpacing={1}
      >
        {word}
      </Text>
    </XStack>
  );
};
