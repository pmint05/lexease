import { BookCarouselCard } from "@/src/components/child/BookCarouselCard";
import { BookGridCard } from "@/src/components/child/BookGridCard";
import { Button } from "@/src/components/shared/Button";
import { storySummaryToBook } from "@/src/core/types";
import { useGenresQuery, useStoriesQuery } from "@/src/hooks/useStoryQueries";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { ScrollView } from "react-native";
import { H4, Text, XStack, YStack } from "tamagui";

/**
 * Modern Library Screen for Child
 * Features:
 * - Personalized greeting
 * - Horizontal carousel for "Continue Reading" or "New Arrivals"
 * - Genre-based filtering
 * - 2-column Grid for the main library
 */
export default function LibraryScreen(): React.ReactElement {
  const router = useRouter();
  const { user } = useAuthStore();
  const [selectedGenreId, setSelectedGenreId] = useState<string>("all");
  const storiesQuery = useStoriesQuery({
    genreId: selectedGenreId === "all" ? undefined : selectedGenreId,
    size: 100,
  });
  const genresQuery = useGenresQuery();

  const categories = useMemo(() => {
    return [{ id: "all", name: "Tất cả" }, ...(genresQuery.data ?? [])];
  }, [genresQuery.data]);

  const books = useMemo(() => {
    return (storiesQuery.data?.items ?? []).map(storySummaryToBook);
  }, [storiesQuery.data?.items]);

  const carouselBooks = useMemo(() => books.slice(0, 5), [books]);

  const handleBookPress = (id: string) => {
    router.push({ pathname: "/(child)/book/[id]", params: { id } });
  };

  const handleReadPress = (id: string) => {
    router.push({
      pathname: "/(child)/reading/[id]",
      params: { id, mode: "resume" },
    });
  };

  return (
    <YStack flex={1} backgroundColor="$background">
      <ScrollView showsVerticalScrollIndicator={false}>
        <YStack gap="$6">
          {/* 1. Greeting Section */}
          <YStack paddingHorizontal="$4" paddingTop="$6" gap="$1">
            <Text fontSize="$4" color="$mutedForeground" fontWeight="500">
              Chào mừng quay trở lại
            </Text>
            <H4 fontWeight="800" color="$foreground">
              {user?.name || "Bé"} ơi, hôm nay đọc gì nhỉ?
            </H4>
          </YStack>

          {/* 2. Carousel Section (Continue Reading / Newest) */}
          <YStack gap="$3">
            <XStack
              paddingHorizontal="$4"
              justifyContent="space-between"
              alignItems="center"
            >
              <Text fontSize="$5" fontWeight="700">
                Sách mới cho bé
              </Text>
            </XStack>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
            >
              {carouselBooks.map((book) => (
                <BookCarouselCard
                  key={book.id}
                  book={book}
                  onPress={handleBookPress}
                  onRead={handleReadPress}
                />
              ))}
            </ScrollView>
          </YStack>

          {/* 3. Category Filter Section */}
          <YStack gap="$3">
            <Text paddingHorizontal="$4" fontSize="$5" fontWeight="700">
              Khám phá theo thể loại
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
            >
              <XStack gap="$2">
                {categories.map((cat) => (
                  <Button
                    key={cat.id}
                    size="small"
                    borderRadius="$10"
                    uiVariant={
                      selectedGenreId === cat.id ? "primary" : "outline"
                    }
                    onPress={() => setSelectedGenreId(cat.id)}
                  >
                    {cat.name}
                  </Button>
                ))}
              </XStack>
            </ScrollView>
          </YStack>

          {/* 4. Main Grid Section */}
          <YStack paddingHorizontal="$4" gap="$4">
            <Text fontSize="$5" fontWeight="700">
              Tất cả sách
            </Text>

            {/* Grid display using flexWrap */}
            <XStack flexWrap="wrap" justifyContent="space-between">
              {books.map((book) => (
                <BookGridCard
                  key={book.id}
                  book={book}
                  onPress={handleBookPress}
                />
              ))}
            </XStack>

            {storiesQuery.isLoading && (
              <YStack paddingVertical="$8" alignItems="center">
                <Text color="$mutedForeground">Đang tải thư viện...</Text>
              </YStack>
            )}

            {storiesQuery.isError && (
              <YStack paddingVertical="$8" alignItems="center">
                <Text color="$mutedForeground">
                  Không thể tải thư viện từ máy chủ.
                </Text>
              </YStack>
            )}

            {!storiesQuery.isLoading && !storiesQuery.isError && books.length === 0 && (
              <YStack paddingVertical="$8" alignItems="center">
                <Text color="$mutedForeground">
                  Hiện chưa có sách trong thể loại này.
                </Text>
              </YStack>
            )}
          </YStack>
        </YStack>
      </ScrollView>
    </YStack>
  );
}
