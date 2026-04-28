import { useReadingStore } from "@/src/store/useReadingStore";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Button, ScrollView, Text, XStack, YStack } from "tamagui";

/**
 * Reading Screen (Full-screen)
 * Main reading experience with:
 * - Karaoke-style word highlighting synchronized with TTS audio
 * - Speed controls (Turtle/Hare)
 * - Audio recording
 * - Word-by-word highlighting via Spotlight metaphor
 * - Animations via Reanimated/Moti
 */
export default function ReadingScreen(): React.ReactElement {
  const router = useRouter();
  useLocalSearchParams<{ id: string }>();
  const { currentIndex, speed, setSpeed, setIsPlaying, isPlaying } =
    useReadingStore();

  // Mock book content
  const mockText = "The quick brown fox jumps over the lazy dog.";
  const words = mockText.split(" ");

  useEffect(() => {
    // Handle hardware back button (Expo Router handles this)
  }, []);

  return (
    <YStack flex={1} backgroundColor="$background" padding="$4" gap="$4">
      {/* Header with close button */}
      <XStack justifyContent="space-between" alignItems="center">
        <Text
          fontSize="$6"
          fontWeight="bold"
          accessibilityRole="header"
          accessibilityLabel="Reading Book ID"
        >
          📖 Reading
        </Text>
        <Button
          size="$3"
          onPress={() => router.back()}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Close reading screen"
        >
          ✕
        </Button>
      </XStack>

      {/* Karaoke Text Display */}
      <ScrollView
        flex={1}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingVertical: 20,
          justifyContent: "center",
        }}
      >
        <XStack flexWrap="wrap" gap="$2" justifyContent="center">
          {words.map((word, idx) => (
            <Text
              key={idx}
              fontSize="$6"
              fontWeight={idx === currentIndex ? "bold" : "normal"}
              color={idx === currentIndex ? "$green" : "$text"}
              backgroundColor={
                idx === currentIndex ? "$yellow3" : "transparent"
              }
              paddingHorizontal="$2"
              paddingVertical="$1"
              borderRadius="$2"
              accessible
              accessibilityRole="text"
              accessibilityLabel={`Word ${idx + 1}: ${word} ${idx === currentIndex ? "highlighted" : ""}`}
            >
              {word}
            </Text>
          ))}
        </XStack>
      </ScrollView>

      {/* Controls */}
      <XStack gap="$2" justifyContent="center" paddingBottom="$4">
        <Button
          size="$4"
          onPress={() => setSpeed(speed === "turtle" ? "hare" : "turtle")}
          accessible
          accessibilityRole="button"
          accessibilityLabel={`Speed control: ${speed}`}
          accessibilityHint="Toggle between Turtle and Hare speed"
        >
          {speed === "turtle" ? "🐢 Slow" : "🐇 Fast"}
        </Button>

        <Button
          size="$4"
          onPress={() => setIsPlaying(!isPlaying)}
          accessible
          accessibilityRole="button"
          accessibilityLabel={isPlaying ? "Pause reading" : "Play reading"}
        >
          {isPlaying ? "⏸ Pause" : "▶ Play"}
        </Button>

        <Button
          size="$4"
          accessible
          accessibilityRole="button"
          accessibilityLabel="Record your reading"
        >
          🎙 Record
        </Button>
      </XStack>
    </YStack>
  );
}
