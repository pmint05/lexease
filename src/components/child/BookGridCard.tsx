import { Card } from "@/src/components/ui/card";
import { Text } from "@/src/components/ui/text";
import { Book } from "@/src/core/types";
import React from "react";
import { Image, Pressable, View } from "react-native";

interface BookGridCardProps {
  book: Book;
  onPress: (id: string) => void;
}

export const BookGridCard = ({
  book,
  onPress,
}: BookGridCardProps): React.ReactElement => {
  return (
    <Pressable onPress={() => onPress(book.id)}>
      <Card className="overflow-hidden p-0 gap-3">
        <Image
          source={{ uri: book.coverUrl }}
          style={{
            width: "100%",
            aspectRatio: 2 / 3,
            backgroundColor: "#F3F4F6",
          }}
          className="rounded-md"
        />
        <View className="px-2.5 pb-2.5">
          <Text className="font-bold text-base" numberOfLines={1}>
            {book.title}
          </Text>
        </View>
      </Card>
    </Pressable>
  );
};
