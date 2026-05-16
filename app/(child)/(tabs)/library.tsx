import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList } from "react-native";
import { Input, Text, XStack, YStack } from "tamagui";

import { BookTile } from "@/src/components/child/BookTile";
import { BookDifficulty } from "@/src/core/types";
import { sampleBooks } from "@/src/data/local/books";
import { useAuthStore } from "@/src/store/useAuthStore";

/**
 * Library Screen
 * Displays available books for the child to read
 * - Shows book list/grid
 * - Search and filter capabilities
 * - Tap to start reading
 */
export default function LibraryScreen(): React.ReactElement {
  const router = useRouter();
  const { logout } = useAuthStore();
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState<BookDifficulty | "all">("all");

  const books = useMemo(() => {
    return sampleBooks.filter((book) => {
      const query = search.trim().toLowerCase();
      const matchesSearch =
        query.length === 0 ||
        [book.title, book.author, book.content].join(" ").toLowerCase().includes(query);
      const matchesDifficulty = difficulty === "all" || book.difficulty === difficulty;
      return matchesSearch && matchesDifficulty;
    });
  }, [difficulty, search]);

  const handleBookPress = (bookId: string) => {
    router.push({
      pathname: "/(child)/book/[id]",
      params: { id: bookId },
    });
  };

  const handleReadPress = (bookId: string) => {
    router.push({
      pathname: "/(child)/reading/[id]",
      params: { id: bookId },
    });
  };

  return (
    <YStack flex={1} backgroundColor="$background" paddingHorizontal="$4" gap="$4">
      <YStack gap="$3" paddingTop="$4">
        <Input
          value={search}
          onChangeText={setSearch}
          placeholder="Tìm sách, tác giả hoặc từ khóa"
          size="$4"
          backgroundColor="$background"
          borderColor="$border"
          color="$foreground"
          accessibilitylabel="Tìm sách"
        />

        <XStack gap="$2" flexWrap="wrap">
          {(["all", "easy", "medium", "hard"] as const).map((item) => (
            <Text
              key={item}
              onPress={() => setDifficulty(item)}
              paddingHorizontal="$3"
              paddingVertical="$2"
              borderRadius="$10"
              backgroundColor={difficulty === item ? "$primary" : "$background"}
              color={difficulty === item ? "$primaryForeground" : "$foreground"}
              borderColor="$border"
              borderWidth={1}
              accessible
              accessibilityRole="button"
              accessibilitylabel={`Lọc theo ${item}`}
            >
              {item === "all" ? "Tất cả" : item}
            </Text>
          ))}
        </XStack>
      </YStack>

      <FlatList
        data={books}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <YStack height="$3" />}
        renderItem={({ item }) => (
          <BookTile book={item} onPress={handleBookPress} onRead={handleReadPress} />
        )}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <YStack paddingVertical="$8" alignItems="center">
            <Text color="$mutedForeground">Không tìm thấy sách phù hợp</Text>
          </YStack>
        }
        showsVerticalScrollIndicator={false}
      />
    </YStack>
  );
}

