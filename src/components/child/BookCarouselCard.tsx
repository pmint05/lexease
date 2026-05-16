import React from "react";
import { Card, Image, Text, YStack, XStack, Button } from "tamagui";
import { Book } from "@/src/core/types";
import { Play } from "lucide-react-native";

interface BookCarouselCardProps {
  book: Book;
  onPress: (id: string) => void;
  onRead: (id: string) => void;
}

export const BookCarouselCard = ({ book, onPress, onRead }: BookCarouselCardProps): React.ReactElement => {
  return (
    <Card
      width={280}
      height={180}
      borderRadius="$6"
      overflow="hidden"
      bordered
      borderColor="$border"
      backgroundColor="$background"
      onPress={() => onPress(book.id)}
      pressStyle={{ scale: 0.98 }}
      marginRight="$4"
      elevate
    >
      <XStack flex={1}>
        <Image
          source={{ uri: book.coverUrl, width: 120, height: 180 }}
          width={120}
          height="100%"
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
            <Text
              fontSize="$2"
              color="$mutedForeground"
              numberOfLines={1}
            >
              {book.author}
            </Text>
          </YStack>
          
          <Button
            size="$3"
            backgroundColor="$primary"
            color="white"
            icon={<Play size={16} fill="white" />}
            onPress={() => onRead(book.id)}
            borderRadius="$4"
            fontWeight="700"
          >
            Đọc tiếp
          </Button>
        </YStack>
      </XStack>
    </Card>
  );
};
