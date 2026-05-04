import React from "react";
import { Text, XStack } from "tamagui";

import { COLORS } from "@/src/core/constants/colors";

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
      backgroundColor={isHighlighted ? COLORS.yellow : "transparent"}
      accessible
      accessibilityRole="text"
      accessibilityLabel={isHighlighted ? `Từ đang được đọc: ${word}` : word}
    >
      <Text
        fontSize="$6"
        fontWeight={isHighlighted ? "700" : "400"}
        color={COLORS.textDark}
        letterSpacing={1}
      >
        {word}
      </Text>
    </XStack>
  );
};
