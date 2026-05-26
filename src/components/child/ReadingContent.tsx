import { FONT_MAP } from "@/src/core/constants/fonts";
import { useReadingStore } from "@/src/store/useReadingStore";
import React, { useEffect, useRef } from "react";
import { ScrollView } from "react-native";
import { Text, XStack, YStack } from "tamagui";

interface ReadingContentProps {
  words: string[];
  currentIndex: number;
  isPlaying: boolean;
  onWordPress: (index: number) => void;
  onManualScroll: () => void;
}

export const ReadingContent = ({
  words,
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
      // flex={1}
      // paddingHorizontal="$4"
      showsVerticalScrollIndicator={false}
      onScrollBeginDrag={handleScrollBeginDrag}
      scrollEventThrottle={16}
      contentContainerStyle={{ paddingBottom: 100 }} // Extra space for centering
    >
      <XStack flexWrap="wrap" gap="$1" alignItems="center" padding="$4">
        {words.map((word, idx) => {
          const isHighlighted = idx === currentIndex;

          return (
            <YStack
              key={`${word}-${idx}`}
              onLayout={(event) => {
                wordLayouts.current[idx] = event.nativeEvent.layout.y;
              }}
              paddingHorizontal="$1.5"
              paddingVertical="$1"
              borderRadius="$3"
              backgroundColor={isHighlighted ? highlightColor : "transparent"}
              opacity={isHighlighted ? 1 : 0.3} // Spotlight metaphor: fade out others
              onPress={() => onWordPress(idx)}
              pressStyle={{ scale: 0.95 }}
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
            </YStack>
          );
        })}
      </XStack>
    </ScrollView>
  );
};
