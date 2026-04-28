import { useRouter } from "expo-router";
import React from "react";
import { Card, ScrollView, Text, YStack } from "tamagui";

/**
 * Library Screen
 * Displays available books for the child to read
 * - Shows book list/grid
 * - Search and filter capabilities
 * - Tap to start reading
 */
export default function LibraryScreen(): React.ReactElement {
  const router = useRouter();

  // Mock books data (TODO: Replace with useBooksQuery hook)
  const mockBooks = [
    { id: "1", title: "The Quick Fox", author: "John Doe", difficulty: "easy" },
    {
      id: "2",
      title: "Adventure Awaits",
      author: "Jane Smith",
      difficulty: "medium",
    },
    {
      id: "3",
      title: "Mystery of the Island",
      author: "Bob Wilson",
      difficulty: "hard",
    },
  ];

  const handleBookPress = (bookId: string) => {
    router.push({
      pathname: "/(child)/reading/[id]",
      params: { id: bookId },
    });
  };

  return (
    <YStack flex={1} backgroundColor="$background" padding="$4" gap="$4">
      <Text
        fontSize="$7"
        fontWeight="bold"
        accessibilityRole="header"
        accessibilityLabel="Book Library"
      >
        📚 My Library
      </Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        <YStack gap="$3">
          {mockBooks.map((book) => (
            <Card
              key={book.id}
              padding="$4"
              onPress={() => handleBookPress(book.id)}
              pressStyle={{ scale: 0.98 }}
              accessible
              accessibilityRole="button"
              accessibilityLabel={`Read ${book.title} by ${book.author}`}
              accessibilityHint="Double-tap to start reading with Karaoke mode"
            >
              <YStack gap="$2">
                <Text fontSize="$5" fontWeight="bold">
                  {book.title}
                </Text>
                <Text fontSize="$3" color="$gray">
                  By {book.author}
                </Text>
                <Text fontSize="$2" color="$blue">
                  Difficulty: {book.difficulty}
                </Text>
              </YStack>
            </Card>
          ))}
        </YStack>
      </ScrollView>
    </YStack>
  );
}
