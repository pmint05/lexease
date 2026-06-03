import { BookGridCard } from "@/src/components/child/BookGridCard";
import { Button } from "@/src/components/shared/Button";
import { Icon } from "@/src/components/ui/icon";
import { Input } from "@/src/components/ui/input";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Text } from "@/src/components/ui/text";
import { storySummaryToBook } from "@/src/core/types";
import { useGenresQuery, useStoriesQuery } from "@/src/hooks/useStoryQueries";
import { useRouter } from "expo-router";
import { FilterX, Library, Search } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { ScrollView, View } from "react-native";

function LibraryGridSkeleton() {
  return (
    <View className="flex-row flex-wrap justify-between">
      {Array.from({ length: 6 }).map((_, index) => (
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

/**
 * Guardian Library Screen
 * Allows guardians to browse all stories and manage access
 */
export default function GuardianLibraryScreen(): React.ReactElement {
  const router = useRouter();
  const [selectedGenreId, setSelectedGenreId] = useState<string>("all");
  const [search, setSearch] = useState("");

  const storiesQuery = useStoriesQuery({
    genreId: selectedGenreId === "all" ? undefined : selectedGenreId,
    keyword: search || undefined,
    size: 100,
  });

  const genresQuery = useGenresQuery();
  const isLoading = storiesQuery.isLoading || genresQuery.isLoading;

  const categories = useMemo(() => {
    return [{ id: "all", name: "Tất cả" }, ...(genresQuery.data ?? [])];
  }, [genresQuery.data]);

  const books = useMemo(() => {
    return (storiesQuery.data?.items ?? []).map(storySummaryToBook);
  }, [storiesQuery.data?.items]);

  const handleBookPress = (id: string) => {
    router.push({ pathname: "/(guardian)/book/[id]", params: { id } });
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]}
      >
        {/* 1. Header Header */}
        <View className="px-4 pt-6 pb-2 gap-1">
          <View className="flex-row items-center gap-2">
            <Icon as={Library} size={24} className="text-primary" />
            <Text className="text-2xl font-bold">Kho truyện</Text>
          </View>
          <Text className="text-muted-foreground text-sm">
            Xem tất cả truyện và quản lý quyền truy cập cho bé.
          </Text>
        </View>

        {/* 2. Search & Filter Bar (Sticky) */}
        <View className="bg-background/95 pb-4 pt-2">
          <View className="px-4 gap-4">
            <View className="relative">
              <Input
                placeholder="Tìm tên truyện hoặc tác giả..."
                value={search}
                onChangeText={setSearch}
                className="pl-10"
              />
              <View className="absolute left-3 top-3">
                <Search size={18} className="text-muted-foreground" />
              </View>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-2">
                {genresQuery.isLoading
                  ? Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} className="h-9 w-20 rounded-full" />
                    ))
                  : categories.map((cat) => (
                      <Button
                        key={cat.id}
                        size="sm"
                        variant={
                          selectedGenreId === cat.id ? "default" : "outline"
                        }
                        onPress={() => setSelectedGenreId(cat.id)}
                        className="rounded-full px-4"
                      >
                        <Text>{cat.name}</Text>
                      </Button>
                    ))}
              </View>
            </ScrollView>
          </View>
        </View>

        {/* 3. Main Grid Section */}
        <View className="px-4 pt-2 pb-10">
          {storiesQuery.isError ? (
            <View className="py-10 items-center gap-3">
              <FilterX size={48} className="text-destructive opacity-20" />
              <Text className="text-muted-foreground text-center">
                Không thể tải danh sách truyện. Vui lòng thử lại sau.
              </Text>
              <Button onPress={() => storiesQuery.refetch()} variant="outline">
                <Text>Thử lại</Text>
              </Button>
            </View>
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
            // <View className="grid grid-cols-2 gap-3">
            //   {books.map((book) => (
            //     <View key={book.id} className="w-full">
            //       <BookGridCard
            //         book={book}
            //         onPress={() => handleBookPress(book.id)}
            //       />
            //     </View>
            //   ))}
            // </View>
            <View className="py-20 items-center gap-2">
              <Search size={48} className="text-muted-foreground opacity-20" />
              <Text className="text-base font-semibold">
                Không tìm thấy truyện nào
              </Text>
              <Text className="text-muted-foreground text-center text-sm px-10">
                Thử thay đổi từ khóa tìm kiếm hoặc chọn thể loại khác nhé!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
