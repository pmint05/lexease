import { COLORS } from "@/src/core/constants/colors";
import { Book } from "@/src/core/types";
import React from "react";
import { Card, Circle, Image, Text, XStack, YStack } from "tamagui";

interface BookGridCardProps {
  book: Book;
  onPress: (id: string) => void;
}

export const BookGridCard = ({
  book,
  onPress,
}: BookGridCardProps): React.ReactElement => {
  const difficultyColor =
    book.difficulty === "easy"
      ? COLORS.success
      : book.difficulty === "medium"
        ? COLORS.warning
        : COLORS.error;

  return (
    <Card
      width="48.5%"
      borderRadius="$4"
      overflow="hidden"
      borderColor="$border"
      backgroundColor="transparent"
      onPress={() => onPress(book.id)}
      marginBottom="$3"
    >
      <Image
        src={book.coverUrl}
        aspectRatio={2 / 3}
        borderRadius="$6"
        width="100%"
        backgroundColor="$color4"
      />
      <YStack padding="$2" gap="$1">
        <Text
          fontFamily="$body"
          fontSize="$3"
          fontWeight="700"
          numberOfLines={1}
          color="$foreground"
        >
          {book.title}
        </Text>
        <XStack alignItems="center" gap="$1.5">
          <Circle size={6} backgroundColor={difficultyColor} />
          <Text
            fontSize="$1"
            color="$mutedForeground"
            textTransform="capitalize"
          >
            {book.difficulty}
          </Text>
        </XStack>
      </YStack>
    </Card>
  );
};
