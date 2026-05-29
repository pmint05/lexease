import { Book } from "@/src/core/types";
import { Play } from "lucide-react-native";
import React from "react";
import { Card, Image, Text, XStack, YStack } from "tamagui";
import { Button } from "../shared/Button";

interface BookCarouselCardProps {
  book: Book;
  onPress: (id: string) => void;
  onRead: (id: string) => void;
}

export const BookCarouselCard = ({
  book,
  onPress,
  onRead,
}: BookCarouselCardProps): React.ReactElement => {
  return (
    <Card
      width={280}
      height={180}
      borderRadius="$6"
      overflow="hidden"
      borderColor="$border"
      backgroundColor="$brandSurface"
      onPress={() => onPress(book.id)}
      marginRight="$4"
    >
      <XStack flex={1}>
        <Image
          src={book.coverUrl}
          width={120}
          height="100%"
          borderRadius="$6"
          backgroundColor="$color4"
        />
        <YStack flex={1} padding="$3" justifyContent="space-between">
          <YStack gap="$1">
            <Text
              fontSize="$2"
              color="$primary"
              fontWeight="700"
              textTransform="uppercase"
              letterSpacing={1}
            >
              {book.category}
            </Text>
            <Text
              fontFamily="$body"
              fontSize="$4"
              fontWeight="800"
              numberOfLines={2}
              color="$foreground"
              lineHeight={20}
            >
              {book.title}
            </Text>
            <Text fontSize="$2" color="$mutedForeground" numberOfLines={1}>
              {book.author}
            </Text>
          </YStack>

          <Button
            size="$3"
            icon={<Play size={16} fill="white" />}
            onPress={() => onRead(book.id)}
            borderRadius="$4"
          >
            Đọc tiếp
          </Button>
        </YStack>
      </XStack>
    </Card>
  );
};
