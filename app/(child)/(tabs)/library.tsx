import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList } from "react-native";
import { Input, Text, XStack, YStack } from "tamagui";

import { BookTile } from "@/src/components/child/BookTile";
import { COLORS } from "@/src/core/constants/colors";
import { BookDifficulty } from "@/src/core/types";
import { sampleBooks } from "@/src/data/local/books";

/**
 * Library Screen
 * Displays available books for the child to read
 * - Shows book list/grid
 * - Search and filter capabilities
 * - Tap to start reading
 */
export default function LibraryScreen(): React.ReactElement {
  const router = useRouter();
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
    <YStack flex={1} backgroundColor={COLORS.cream} padding="$4" gap="$4">
      <XStack justifyContent="space-between" alignItems="center">
        <Text
          fontSize="$7"
          fontWeight="bold"
          accessibilityRole="header"
          accessibilityLabel="Book Library"
        >
          📚 Thư viện của bé
        </Text>
        <Text
          onPress={() => router.replace("/(auth)/role-selection")}
          padding="$2"
          color={COLORS.blue}
          fontWeight="700"
          accessible
          accessibilityRole="button"
          accessibilityLabel="Quay lại chọn vai trò"
        >
          Đổi vai trò
        </Text>
      </XStack>

      <YStack gap="$3">
        <Input
          value={search}
          onChangeText={setSearch}
          placeholder="Tìm sách, tác giả hoặc từ khóa"
          size="$4"
          accessibilityLabel="Tìm sách"
        />

        <XStack gap="$2" flexWrap="wrap">
          {(["all", "easy", "medium", "hard"] as const).map((item) => (
            <Text
              key={item}
              onPress={() => setDifficulty(item)}
              paddingHorizontal="$3"
              paddingVertical="$2"
              borderRadius="$10"
              backgroundColor={difficulty === item ? COLORS.blue : "$background"}
              color={difficulty === item ? "white" : COLORS.textDark}
              accessible
              accessibilityRole="button"
              accessibilityLabel={`Lọc theo ${item}`}
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
            <Text color={COLORS.textMuted}>Không tìm thấy sách phù hợp</Text>
          </YStack>
        }
        showsVerticalScrollIndicator={false}
      />
    </YStack>
  );
}
