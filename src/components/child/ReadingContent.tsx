import { Text } from "@/src/components/ui/text";
import { FONT_MAP } from "@/src/core/constants/fonts";
import { useReadingStore } from "@/src/store/useReadingStore";
import type { ReadingTextToken } from "@/src/utils/textProcessing";
import React, { useEffect, useRef } from "react";
import { Pressable, ScrollView, View } from "react-native";

interface ReadingContentProps {
  tokens: ReadingTextToken[];
  currentIndex: number;
  isPlaying: boolean;
  onWordPress: (index: number) => void;
  onManualScroll: () => void;
}

export const ReadingContent = ({
  tokens,
  currentIndex,
  isPlaying,
  onWordPress,
  onManualScroll,
}: ReadingContentProps): React.ReactElement => {
  const {
    fontSize,
    fontFamily,
    textColor,
    highlightColor,
    letterSpacing,
    lineHeight,
  } = useReadingStore();

  const scrollRef = useRef<ScrollView>(null);
  const wordLayouts = useRef<Record<number, number>>({});
  const isAutoScrolling = useRef(false);

  const tamaguiFontKey = FONT_MAP[fontFamily] || "body";

  // Auto-scroll logic: Keep active word in center
  useEffect(() => {
    if (isPlaying && wordLayouts.current[currentIndex] !== undefined) {
      isAutoScrolling.current = true;
      scrollRef.current?.scrollTo({
        y: wordLayouts.current[currentIndex] - 150, // Approx center
        animated: true,
      });
      setTimeout(() => {
        isAutoScrolling.current = false;
      }, 500);
    }
  }, [currentIndex, isPlaying]);

  const handleScrollBeginDrag = () => {
    onManualScroll();
  };

  return (
    <ScrollView
      ref={scrollRef}
      showsVerticalScrollIndicator={false}
      onScrollBeginDrag={handleScrollBeginDrag}
      scrollEventThrottle={16}
      contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 16 }}
    >
      <View
        style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center" }}
      >
        {tokens.map((token, idx) => {
          const wordIndex = token.wordIndex;
          const isHighlighted = wordIndex === currentIndex;

          if (wordIndex === null) {
            return (
              <Text
                key={`${token.text}-${idx}`}
                style={{
                  fontFamily: tamaguiFontKey,
                  fontSize,
                  fontWeight: "400",
                  color: textColor,
                  letterSpacing,
                  lineHeight: fontSize * lineHeight,
                  opacity: 0.3,
                  marginRight: token.spaceAfter ? 6 : 0,
                }}
              >
                {token.text}
              </Text>
            );
          }

          return (
            <Pressable
              key={`${token.text}-${idx}`}
              onLayout={(event) => {
                wordLayouts.current[wordIndex] = event.nativeEvent.layout.y;
              }}
              onPress={() => onWordPress(wordIndex)}
              style={{
                paddingHorizontal: 6,
                paddingVertical: 4,
                borderRadius: 8,
                backgroundColor: isHighlighted ? highlightColor : "transparent",
                opacity: isHighlighted ? 1 : 0.3,
                marginRight: token.spaceAfter ? 6 : 0,
              }}
            >
              <Text
                style={{
                  fontFamily: tamaguiFontKey,
                  fontSize,
                  fontWeight: isHighlighted ? "700" : "400",
                  color: textColor,
                  letterSpacing,
                  lineHeight: fontSize * lineHeight,
                }}
              >
                {token.text}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
};
