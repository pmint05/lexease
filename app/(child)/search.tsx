import React, { useState, useMemo, useEffect, useRef } from "react";
import { YStack, XStack, Input, Text, Button, ScrollView, FlatList } from "tamagui";
import { useRouter } from "expo-router";
import { ChevronLeft, Search as SearchIcon, X } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { sampleBooks } from "@/src/data/local/books";
import { BookGridCard } from "@/src/components/child/BookGridCard";
import { BookDifficulty } from "@/src/core/types";

export default function SearchScreen(): React.ReactElement {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState<BookDifficulty | "all">("all");
  const inputRef = useRef<any>(null);

  useEffect(() => {
    // Auto focus the search input
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const results = useMemo(() => {
    const trimmedQuery = query.trim().toLowerCase();
    return sampleBooks.filter((book) => {
      const matchesSearch = 
        trimmedQuery.length === 0 || 
        book.title.toLowerCase().includes(trimmedQuery) ||
        book.author.toLowerCase().includes(trimmedQuery) ||
        book.category.toLowerCase().includes(trimmedQuery);
      
      const matchesDifficulty = difficulty === "all" || book.difficulty === difficulty;
      
      return matchesSearch && matchesDifficulty;
    });
  }, [query, difficulty]);

  return (
    <YStack flex={1} backgroundColor="$background">
      {/* Header Search Bar */}
      <XStack 
        paddingHorizontal="$4" 
        paddingTop={insets.top + 8} 
        paddingBottom="$2" 
        alignItems="center" 
        gap="$2"
        borderBottomWidth={1}
        borderBottomColor="$border"
      >
        <Button 
          icon={<ChevronLeft size={24} />} 
          chromeless 
          onPress={() => router.back()} 
          padding={0}
          width={40}
        />
        <XStack flex={1} position="relative">
          <Input
            ref={inputRef}
            flex={1}
            value={query}
            onChangeText={setQuery}
            placeholder="Tìm kiếm sách..."
            size="$4"
            paddingLeft="$10"
            borderRadius="$10"
            backgroundColor="$color3"
            borderWidth={0}
          />
          <YStack position="absolute" left="$3" top={0} bottom={0} justifyContent="center">
            <SearchIcon size={18} color="$mutedForeground" />
          </YStack>
          {query.length > 0 && (
            <YStack 
              position="absolute" 
              right="$3" 
              top={0} 
              bottom={0} 
              justifyContent="center"
              onPress={() => setQuery("")}
            >
              <X size={18} color="$mutedForeground" />
            </YStack>
          )}
        </XStack>
      </XStack>

      {/* Filters */}
      <XStack padding="$4" gap="$2" flexWrap="wrap">
        {(["all", "easy", "medium", "hard"] as const).map((item) => (
          <Button
            key={item}
            size="$3"
            borderRadius="$10"
            theme={difficulty === item ? "active" : "alt1"}
            onPress={() => setDifficulty(item)}
            variant={difficulty === item ? undefined : "outline"}
          >
            {item === "all" ? "Tất cả" : item.charAt(0).toUpperCase() + item.slice(1)}
          </Button>
        ))}
      </XStack>

      {/* Results */}
      <FlatList
        data={results}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 16, gap: 12 }}
        contentContainerStyle={{ paddingBottom: 20 }}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BookGridCard 
            book={item} 
            onPress={(id) => router.push({ pathname: "/(child)/book/[id]", params: { id } })} 
          />
        )}
        ListEmptyComponent={
          <YStack paddingVertical="$10" alignItems="center" gap="$2">
            <Text color="$mutedForeground">Không tìm thấy cuốn sách nào khớp với tìm kiếm của bé.</Text>
          </YStack>
        }
      />
    </YStack>
  );
}
