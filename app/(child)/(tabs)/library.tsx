import { BookCarouselCard } from "@/src/components/child/BookCarouselCard";
import { BookGridCard } from "@/src/components/child/BookGridCard";
import { Button } from "@/src/components/shared/Button";
import { Text } from "@/src/components/ui/text";
import { storySummaryToBook } from "@/src/core/types";
import { useGenresQuery, useStoriesQuery } from "@/src/hooks/useStoryQueries";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { ScrollView, View } from "react-native";

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
    <View className="flex-1 bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="gap-6">
          {/* 1. Greeting Section */}
          <View className="px-4 pt-6 gap-1">
            <Text className="text-muted-foreground text-base font-medium">
              Chào mừng quay trở lại
            </Text>
            <Text className="text-2xl font-extrabold">
              {user?.name || "Bé"} ơi, hôm nay đọc gì nhỉ?
            </Text>
          </View>

          {/* 2. Carousel Section (Continue Reading / Newest) */}
          <View className="gap-3">
            <View className="px-4 flex-row justify-between items-center">
              <Text className="text-lg font-semibold">Sách mới cho bé</Text>
            </View>
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
          </View>

          {/* 3. Category Filter Section */}
          <View className="gap-3">
            <Text className="px-4 text-lg font-semibold">
              Khám phá theo thể loại
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
            >
              <View className="flex-row gap-2">
                {categories.map((cat) => (
                  <Button
                    key={cat.id}
                    size="small"
                    uiVariant={
                      selectedGenreId === cat.id ? "primary" : "outline"
                    }
                    onPress={() => setSelectedGenreId(cat.id)}
                  >
                    {cat.name}
                  </Button>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* 4. Main Grid Section */}
          <View className="px-4 gap-4">
            <View className="flex-row flex-wrap justify-between">
              {books.map((book) => (
                <BookGridCard
                  key={book.id}
                  book={book}
                  onPress={handleBookPress}
                />
              ))}
            </View>

            {storiesQuery.isLoading && (
              <View className="py-8 items-center">
                <Text className="text-muted-foreground">
                  Đang tải thư viện...
                </Text>
              </View>
            )}

            {storiesQuery.isError && (
              <View className="py-8 items-center">
                <Text className="text-muted-foreground">
                  Không thể tải thư viện từ máy chủ.
                </Text>
              </View>
            )}

            {!storiesQuery.isLoading &&
              !storiesQuery.isError &&
              books.length === 0 && (
                <View className="py-8 items-center">
                  <Text className="text-muted-foreground">
                    Hiện chưa có sách trong thể loại này.
                  </Text>
                </View>
              )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
