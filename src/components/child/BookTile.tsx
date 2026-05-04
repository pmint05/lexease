import { BookOpen, ChevronRight, Clock3, Volume2 } from "lucide-react-native";
import React from "react";
import { Button, Card, Text, XStack, YStack } from "tamagui";

import { COLORS } from "@/src/core/constants/colors";
import { Book } from "@/src/core/types";

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

export const BookTile = ({ book, onPress, onRead }: BookTileProps): React.ReactElement => {
  return (
    <Card
      padding="$4"
      borderWidth={1}
      borderColor="$color5"
      backgroundColor="$background"
      accessible
      accessibilityRole="summary"
      accessibilityLabel={`Sách ${book.title} của ${book.author}. Độ khó ${book.difficulty}`}
      accessibilityHint="Dùng nút Xem hoặc Đọc ở bên phải"
    >
      <XStack gap="$3" alignItems="center">
        <YStack
          width={56}
          height={56}
          borderRadius="$4"
          backgroundColor={difficultyColor[book.difficulty]}
          alignItems="center"
          justifyContent="center"
        >
          <BookOpen color={COLORS.textDark} size={24} />
        </YStack>

        <YStack flex={1} gap="$2">
          <Text fontSize="$5" fontWeight="700" color="$color11" numberOfLines={1}>
            {book.title}
          </Text>
          <Text color="$color10" numberOfLines={1}>
            {book.author}
          </Text>
          <XStack gap="$2" flexWrap="wrap" alignItems="center">
            <Text color="$color10">{book.difficulty}</Text>
            <XStack gap="$1" alignItems="center">
              <Clock3 color={COLORS.textMuted} size={14} />
              <Text color="$color10">~{book.estimatedMinutes} phút</Text>
            </XStack>
          </XStack>
        </YStack>

        <YStack gap="$2">
          <Button
            size="$3"
            onPress={() => onPress(book.id)}
            icon={<ChevronRight color={COLORS.textDark} size={16} />}
            accessibilityRole="button"
            accessibilityLabel={`Xem chi tiết ${book.title}`}
          >
            Xem
          </Button>
          <Button
            size="$3"
            onPress={() => onRead(book.id)}
            icon={<Volume2 color={COLORS.textDark} size={16} />}
            backgroundColor={COLORS.green}
            accessibilityRole="button"
            accessibilityLabel={`Đọc ngay ${book.title}`}
          >
            Đọc
          </Button>
        </YStack>
      </XStack>
    </Card>
  );
};
