import React from "react";
import { Text, XStack } from "tamagui";
import { useReadingStore } from "@/src/store/useReadingStore";
import { FONT_MAP } from "@/src/core/constants/fonts";

interface KaraokeTileProps {
  word: string;
  isHighlighted: boolean;
}

export const KaraokeTile = ({ word, isHighlighted }: KaraokeTileProps): React.ReactElement => {
  const { fontSize, fontFamily, textColor, highlightColor, letterSpacing, lineHeight } = useReadingStore();
  
  const tamaguiFontKey = FONT_MAP[fontFamily] || "body";

  return (
    <XStack
      paddingHorizontal="$2"
      paddingVertical="$1"
      borderRadius="$3"
      backgroundColor={isHighlighted ? highlightColor : "transparent"}
      accessible
      accessibilityRole="text"
      accessibilitylabel={isHighlighted ? `Từ đang được đọc: ${word}` : word}
    >
      <Text
        fontFamily={`$${tamaguiFontKey}`}
        fontSize={fontSize}
        fontWeight={isHighlighted ? "700" : "400"}
        color={textColor}
        letterSpacing={letterSpacing}
        lineHeight={fontSize * lineHeight}
      >
        {word}
      </Text>
    </XStack>
  );
};
