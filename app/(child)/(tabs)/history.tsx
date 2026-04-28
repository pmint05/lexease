import React from "react";
import { Button, Card, ScrollView, Text, XStack, YStack } from "tamagui";

/**
 * History Screen
 * Displays child's past recordings and reading history
 * - List of recorded readings with playback
 * - Audio Vault: Saved voice recordings
 */
export default function HistoryScreen(): React.ReactElement {
  // Mock history data (TODO: Replace with useHistoryQuery hook)
  const mockHistory = [
    {
      id: "rec-1",
      bookTitle: "The Quick Fox",
      date: "2026-04-28",
      duration: "5:30",
      type: "recording",
    },
    {
      id: "rec-2",
      bookTitle: "Adventure Awaits",
      date: "2026-04-27",
      duration: "8:15",
      type: "reading",
    },
  ];

  return (
    <YStack flex={1} backgroundColor="$background" padding="$4" gap="$4">
      <Text
        fontSize="$7"
        fontWeight="bold"
        accessibilityRole="header"
        accessibilityLabel="Reading History"
      >
        🎙️ My Recordings
      </Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        <YStack gap="$3">
          {mockHistory.map((item) => (
            <Card
              key={item.id}
              padding="$4"
              accessible
              accessibilityRole="button"
              accessibilityLabel={`${item.bookTitle} - ${item.date}`}
            >
              <YStack gap="$2">
                <Text fontSize="$5" fontWeight="bold">
                  {item.bookTitle}
                </Text>
                <XStack justifyContent="space-between">
                  <Text fontSize="$3" color="$gray">
                    {item.date}
                  </Text>
                  <Text fontSize="$3" color="$blue">
                    {item.duration}
                  </Text>
                </XStack>
                <Button
                  size="$3"
                  accessible
                  accessibilityRole="button"
                  accessibilityLabel={`Play ${item.bookTitle}`}
                >
                  ▶ Play
                </Button>
              </YStack>
            </Card>
          ))}
        </YStack>
      </ScrollView>
    </YStack>
  );
}
