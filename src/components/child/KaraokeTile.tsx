import { Text } from "@/src/components/ui/text";
import { FONTS } from "@/src/core/constants/fonts";
import { useReadingStore } from "@/src/store/useReadingStore";
import React from "react";
import { View } from "react-native";

interface KaraokeTileProps {
  word: string;
  isHighlighted: boolean;
}

export const KaraokeTile = ({
  word,
  isHighlighted,
}: KaraokeTileProps): React.ReactElement => {
  const {
    fontSize,
    fontFamily,
    textColor,
    highlightColor,
    letterSpacing,
    lineHeight,
  } = useReadingStore();

  const mappedFamily =
    fontFamily === "Lexend"
      ? FONTS.lexend
      : fontFamily === "OpenDyslexic"
        ? FONTS.openDyslexic
        : FONTS.lexend;

  return (
    <View
      style={{
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        backgroundColor: isHighlighted ? highlightColor : "transparent",
      }}
      accessible
      accessibilityRole="text"
      accessibilityLabel={isHighlighted ? `Từ đang được đọc: ${word}` : word}
    >
      <Text
        style={{
          fontFamily: mappedFamily,
          fontSize,
          fontWeight: isHighlighted ? "700" : "400",
          color: textColor,
          letterSpacing,
          lineHeight: fontSize * lineHeight,
        }}
      >
        {word}
      </Text>
    </View>
  );
};
