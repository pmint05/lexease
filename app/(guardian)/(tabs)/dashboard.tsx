import React from "react";
import { Card, ScrollView, Text, XStack, YStack } from "tamagui";

/**
 * Guardian Dashboard Screen
 * Displays analytics and progress insights for the child:
 * - Reading time summary
 * - Comprehension scores
 * - Reading streak
 * - Progress charts
 * - Vocabulary growth
 */
export default function DashboardScreen(): React.ReactElement {
  // Mock analytics data (TODO: Replace with useAnalyticsQuery hook)
  const mockAnalytics = {
    totalReadingTime: "15h 30m",
    averageComprehension: "87%",
    readingStreak: "7 days",
    wordsRead: "2,450",
  };

  return (
    <YStack flex={1} backgroundColor="$background" padding="$4" gap="$4">
      <Text
        fontSize="$7"
        fontWeight="bold"
        accessibilityRole="header"
        accessibilityLabel="Progress Dashboard"
      >
        📊 Progress Dashboard
      </Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        <YStack gap="$3">
          {/* Stats Cards */}
          <Card padding="$4">
            <YStack gap="$3">
              <XStack justifyContent="space-between">
                <YStack>
                  <Text fontSize="$2" color="$gray">
                    Total Reading Time
                  </Text>
                  <Text fontSize="$6" fontWeight="bold">
                    {mockAnalytics.totalReadingTime}
                  </Text>
                </YStack>
                <Text fontSize="$8">⏱️</Text>
              </XStack>
            </YStack>
          </Card>

          <Card padding="$4">
            <YStack gap="$3">
              <XStack justifyContent="space-between">
                <YStack>
                  <Text fontSize="$2" color="$gray">
                    Comprehension Score
                  </Text>
                  <Text fontSize="$6" fontWeight="bold">
                    {mockAnalytics.averageComprehension}
                  </Text>
                </YStack>
                <Text fontSize="$8">✅</Text>
              </XStack>
            </YStack>
          </Card>

          <Card padding="$4">
            <YStack gap="$3">
              <XStack justifyContent="space-between">
                <YStack>
                  <Text fontSize="$2" color="$gray">
                    Reading Streak
                  </Text>
                  <Text fontSize="$6" fontWeight="bold">
                    {mockAnalytics.readingStreak}
                  </Text>
                </YStack>
                <Text fontSize="$8">🔥</Text>
              </XStack>
            </YStack>
          </Card>

          <Card padding="$4">
            <YStack gap="$3">
              <XStack justifyContent="space-between">
                <YStack>
                  <Text fontSize="$2" color="$gray">
                    Words Read
                  </Text>
                  <Text fontSize="$6" fontWeight="bold">
                    {mockAnalytics.wordsRead}
                  </Text>
                </YStack>
                <Text fontSize="$8">📚</Text>
              </XStack>
            </YStack>
          </Card>

          {/* Chart Placeholder */}
          <Card
            padding="$4"
            minHeight={200}
            justifyContent="center"
            alignItems="center"
            accessible
            accessibilityRole="image"
            accessibilityLabel="Reading time chart placeholder"
          >
            <Text color="$gray">📈 Chart Component (Victory Native)</Text>
          </Card>
        </YStack>
      </ScrollView>
    </YStack>
  );
}
