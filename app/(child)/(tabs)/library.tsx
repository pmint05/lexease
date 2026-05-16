import React, { useMemo, useState } from "react";
import { ScrollView } from "react-native";
import { YStack, XStack, Text, Button, H4 } from "tamagui";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useLearningStore } from "@/src/store/useLearningStore";
import { sampleBooks } from "@/src/data/local/books";
import { BookGridCard } from "@/src/components/child/BookGridCard";
import { BookCarouselCard } from "@/src/components/child/BookCarouselCard";

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
  const { sessions } = useLearningStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("Tất cả");

  // Get categories from sample books
  const categories = useMemo(() => {
    const cats = new Set(sampleBooks.map(b => b.category));
    return ["Tất cả", ...Array.from(cats)];
  }, []);

  // Books to show in Carousel (Recently read or Newest)
  const carouselBooks = useMemo(() => {
    const recentBookIds = Array.from(new Set(sessions.map(s => s.bookId)));
    const recentBooks = recentBookIds
      .map(id => sampleBooks.find(b => b.id === id))
      .filter((b): b is any => !!b)
      .slice(0, 5);

    // If no recent books, show the latest additions
    return recentBooks.length > 0 ? recentBooks : sampleBooks.slice(-5).reverse();
  }, [sessions]);

  // Filtered books for the grid
  const filteredBooks = useMemo(() => {
    if (selectedCategory === "Tất cả") return sampleBooks;
    return sampleBooks.filter(b => b.category === selectedCategory);
  }, [selectedCategory]);

  const handleBookPress = (id: string) => {
    router.push({ pathname: "/(child)/book/[id]", params: { id } });
  };

  const handleReadPress = (id: string) => {
    router.push({ pathname: "/(child)/reading/[id]", params: { id } });
  };

  return (
    <YStack flex={1} backgroundColor="$background">
      <ScrollView showsVerticalScrollIndicator={false}>
        <YStack gap="$6" paddingBottom="$10">
          
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
            <XStack paddingHorizontal="$4" justifyContent="space-between" alignItems="center">
              <Text fontSize="$5" fontWeight="700">
                {sessions.length > 0 ? "Tiếp tục khám phá" : "Sách mới cho bé"}
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
                    key={cat}
                    size="$3"
                    borderRadius="$10"
                    theme={selectedCategory === cat ? "active" : "alt1"}
                    variant={selectedCategory === cat ? undefined : "outline"}
                    onPress={() => setSelectedCategory(cat)}
                  >
                    {cat}
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
              {filteredBooks.map((book) => (
                <BookGridCard 
                  key={book.id} 
                  book={book} 
                  onPress={handleBookPress} 
                />
              ))}
            </XStack>

            {filteredBooks.length === 0 && (
              <YStack paddingVertical="$8" alignItems="center">
                <Text color="$mutedForeground">Hiện chưa có sách trong thể loại này.</Text>
              </YStack>
            )}
          </YStack>
          
        </YStack>
      </ScrollView>
    </YStack>
  );
}
