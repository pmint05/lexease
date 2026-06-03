import { BookCarouselCard } from "@/src/components/child/BookCarouselCard";
import { BookGridCard } from "@/src/components/child/BookGridCard";
import { Button } from "@/src/components/shared/Button";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Text } from "@/src/components/ui/text";
import { storySummaryToBook } from "@/src/core/types";
import { useGenresQuery, useStoriesQuery } from "@/src/hooks/useStoryQueries";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { ScrollView, View } from "react-native";

function LibraryCarouselSkeleton() {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16 }}
    >
      <View className="flex-row gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <View
            key={index}
            className="w-[300px] overflow-hidden rounded-2xl border border-border bg-card p-0"
          >
            <View className="flex-row">
              <Skeleton className="h-full min-h-[180px] w-[120px] rounded-l-2xl rounded-r-none" />
              <View className="flex-1 gap-3 p-4">
                <Skeleton className="h-4 w-24 rounded-full" />
                <Skeleton className="h-6 w-4/5 rounded-full" />
                <Skeleton className="h-4 w-3/5 rounded-full" />
                <View className="mt-auto">
                  <Skeleton className="h-11 w-full rounded-xl" />
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

function LibraryGridSkeleton() {
  return (
    <View className="flex-row flex-wrap justify-between">
      {Array.from({ length: 8 }).map((_, index) => (
        <View key={index} style={{ width: "48.5%", marginBottom: 12 }}>
          <View className="overflow-hidden rounded-2xl border border-border bg-card p-0 gap-3">
            <Skeleton className="w-full aspect-[2/3] rounded-b-none rounded-t-2xl" />
            <View className="px-2.5 pb-2.5">
              <Skeleton className="h-5 w-4/5 rounded-full" />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

function ErrorState({
  title,
  message,
  onRetry,
}: {
  title: string;
  message: string;
  onRetry: () => void;
}) {
  return (
    <View className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-4 gap-3">
      <View className="gap-1">
        <Text className="text-base font-semibold text-destructive">
          {title}
        </Text>
        <Text className="text-sm text-muted-foreground">{message}</Text>
      </View>
      <View className="items-start">
        <Button uiVariant="danger" size="small" onPress={onRetry}>
          Thử lại
        </Button>
      </View>
    </View>
  );
}

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
  const isLoading = storiesQuery.isLoading || genresQuery.isLoading;
  const hasError = storiesQuery.isError || genresQuery.isError;

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
            {storiesQuery.isError ? (
              <View className="px-4">
                <ErrorState
                  title="Không tải được sách mới"
                  message="Danh sách sách từ máy chủ hiện chưa sẵn sàng. Bạn có thể thử lại để tải lại nội dung mới nhất."
                  onRetry={() => void storiesQuery.refetch()}
                />
              </View>
            ) : isLoading ? (
              <LibraryCarouselSkeleton />
            ) : (
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
            )}
          </View>

          {/* 3. Category Filter Section */}
          <View className="gap-3">
            <Text className="px-4 text-lg font-semibold">
              Khám phá theo thể loại
            </Text>
            {genresQuery.isError ? (
              <View className="px-4">
                <ErrorState
                  title="Không tải được thể loại"
                  message="Bộ lọc thể loại đang gặp lỗi. Danh sách sách vẫn có thể hiển thị, nhưng chưa thể lọc chính xác ngay lúc này."
                  onRetry={() => void genresQuery.refetch()}
                />
              </View>
            ) : genresQuery.isLoading ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16 }}
              >
                <View className="flex-row gap-2">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Skeleton key={index} className="h-10 w-24 rounded-full" />
                  ))}
                </View>
              </ScrollView>
            ) : (
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
            )}
          </View>

          {/* 4. Main Grid Section */}
          <View className="px-4 gap-4">
            {storiesQuery.isError ? (
              <ErrorState
                title="Không tải được thư viện"
                message="Hệ thống chưa lấy được danh sách sách. Kiểm tra kết nối hoặc thử tải lại để tiếp tục."
                onRetry={() => void storiesQuery.refetch()}
              />
            ) : isLoading ? (
              <LibraryGridSkeleton />
            ) : books.length > 0 ? (
              <View className="flex-row flex-wrap justify-between pb-5">
                {books.map((book) => (
                  <BookGridCard
                    key={book.id}
                    className="w-[48.5%] mb-3"
                    book={book}
                    onPress={() => handleBookPress(book.id)}
                  />
                ))}
              </View>
            ) : (
              <View className="rounded-2xl border border-border bg-card px-4 py-8 items-center gap-2">
                <Text className="text-base font-semibold">
                  Chưa có sách trong mục này
                </Text>
                <Text className="text-muted-foreground text-center text-sm">
                  Hãy đổi thể loại hoặc quay lại sau để xem thêm nội dung mới.
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
