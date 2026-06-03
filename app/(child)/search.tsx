import { BookGridCard } from "@/src/components/child/BookGridCard";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Text } from "@/src/components/ui/text";
import { storySummaryToBook } from "@/src/core/types";
import { useGenresQuery, useStoriesQuery } from "@/src/hooks/useStoryQueries";
import { useRouter } from "expo-router";
import { ChevronLeft, Search as SearchIcon, X } from "lucide-react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { FlatList, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SearchScreen(): React.ReactElement {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  const [genreId, setGenreId] = useState<string>("all");
  const inputRef = useRef<any>(null);
  const storiesQuery = useStoriesQuery({
    keyword: query.trim() || undefined,
    genreId: genreId === "all" ? undefined : genreId,
    size: 100,
  });
  const genresQuery = useGenresQuery();

  useEffect(() => {
    // Auto focus the search input
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const results = useMemo(() => {
    return (storiesQuery.data?.items ?? []).map(storySummaryToBook);
  }, [storiesQuery.data?.items]);

  const genres = useMemo(() => {
    return [{ id: "all", name: "Tất cả" }, ...(genresQuery.data ?? [])];
  }, [genresQuery.data]);

  return (
    <View className="flex-1 bg-background">
      {/* Header Search Bar */}
      <View
        style={{
          paddingTop: insets.top + 8,
          paddingBottom: 8,
        }}
        className="flex-row items-center border-b border-border bg-card gap-2 px-2"
      >
        <Button
          onPress={() =>
            router.canGoBack()
              ? router.back()
              : router.push("/(child)/(tabs)/library")
          }
          size="icon"
          variant="ghost"
          accessibilityLabel="Quay lại"
        >
          <ChevronLeft className="text-foreground size-4" />
        </Button>
        <View style={{ flex: 1 }} className="relative">
          <Input
            ref={inputRef}
            className="flex-1 pl-8 rounded-xl bg-color3"
            value={query}
            onChangeText={setQuery}
            placeholder="Tìm kiếm sách..."
            clearButtonMode="while-editing"
          />
          <View className="absolute left-3 top-0 bottom-0 justify-center">
            <SearchIcon className="text-muted-foreground" size={18} />
          </View>
          {query.length > 0 && (
            <Pressable
              onPress={() => setQuery("")}
              className="absolute right-3 top-0 bottom-0 justify-center"
            >
              <X className="text-muted-foreground" size={18} />
            </Pressable>
          )}
        </View>
      </View>

      {/* Filters */}
      <View className="p-4 flex-row flex-wrap gap-2">
        {genres.map((item) => (
          <Button
            key={item.id}
            onPress={() => setGenreId(item.id)}
            className={
              genreId === item.id
                ? "bg-primary border-primary"
                : "bg-color3 border-border"
            }
          >
            <Text
              className={
                genreId === item.id
                  ? "text-primary-foreground"
                  : "text-foreground"
              }
            >
              {item.name}
            </Text>
          </Button>
        ))}
      </View>

      {/* Results */}
      <FlatList
        data={results}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-between",
          paddingLeft: 16,
          paddingRight: 28,
          gap: 12,
        }}
        contentContainerStyle={{ paddingBottom: 20 }}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BookGridCard
            className="w-1/2 mb-4"
            book={item}
            onPress={(id) =>
              router.push({ pathname: "/(child)/book/[id]", params: { id } })
            }
          />
        )}
        ListEmptyComponent={
          <View className="items-center">
            <Text className="text-muted-foreground text-center p-2">
              Không tìm thấy cuốn sách nào khớp với tìm kiếm của bé.
            </Text>
          </View>
        }
      />
    </View>
  );
}
