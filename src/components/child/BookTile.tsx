import { Card } from "@/src/components/ui/card";
import { Text } from "@/src/components/ui/text";
import { BookOpen, ChevronRight, Clock3, Volume2 } from "lucide-react-native";
import React from "react";
import { View } from "react-native";

import { COLORS } from "@/src/core/constants/colors";
import { Book } from "@/src/core/types";
import { Button } from "../shared/Button";

interface BookTileProps {
  book: Book;
  onPress: (bookId: string) => void;
  onRead: (bookId: string) => void;
}

const difficultyColor: Record<Book["difficulty"], string> = {
  easy: COLORS.easy,
  medium: COLORS.medium,
  hard: COLORS.hard,
};

export const BookTile = ({
  book,
  onPress,
  onRead,
}: BookTileProps): React.ReactElement => {
  return (
    <Card
      accessible
      accessibilityRole="summary"
      accessibilityLabel={`Sách ${book.title} của ${book.author}. Độ khó ${book.difficulty}`}
      accessibilityHint="Dùng nút Xem hoặc Đọc ở bên phải"
      className="p-4"
    >
      <View className="flex-row items-center gap-3">
        <View
          style={{
            width: 56,
            height: 56,
            backgroundColor: difficultyColor[book.difficulty],
            borderRadius: 8,
          }}
          className="items-center justify-center"
        >
          <BookOpen size={24} />
        </View>

        <View style={{ flex: 1 }} className="gap-2">
          <Text className="font-semibold text-base" numberOfLines={1}>
            {book.title}
          </Text>
          <Text className="text-muted-foreground" numberOfLines={1}>
            {book.author}
          </Text>
          <View className="flex-row gap-2 flex-wrap items-center">
            <Text className="text-muted-foreground">{book.difficulty}</Text>
            <View className="flex-row gap-1 items-center">
              <Clock3 size={14} />
              <Text className="text-muted-foreground">
                ~{book.estimatedMinutes} phút
              </Text>
            </View>
          </View>
        </View>

        <View className="gap-2">
          <Button
            onPress={() => onPress(book.id)}
            icon={<ChevronRight size={16} />}
            accessibilityRole="button"
          >
            Xem
          </Button>
          <Button
            onPress={() => onRead(book.id)}
            icon={<Volume2 size={16} />}
            uiVariant="success"
            accessibilityRole="button"
          >
            Đọc
          </Button>
        </View>
      </View>
    </Card>
  );
};
