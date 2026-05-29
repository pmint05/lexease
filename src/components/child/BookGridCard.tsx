import { Card } from "@/src/components/ui/card";
import { Text } from "@/src/components/ui/text";
import { COLORS } from "@/src/core/constants/colors";
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
  const difficultyColor =
    book.difficulty === "easy"
      ? COLORS.success
      : book.difficulty === "medium"
        ? COLORS.warning
        : COLORS.error;

  return (
    <Pressable
      onPress={() => onPress(book.id)}
      style={{ width: "48.5%", marginBottom: 12 }}
    >
      <Card className="overflow-hidden">
        <Image
          source={{ uri: book.coverUrl }}
          style={{
            width: "100%",
            aspectRatio: 2 / 3,
            borderRadius: 12,
            backgroundColor: "#F3F4F6",
          }}
        />
        <View style={{ padding: 8 }}>
          <Text className="font-bold text-base" numberOfLines={1}>
            {book.title}
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              marginTop: 4,
            }}
          >
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: difficultyColor,
              }}
            />
            <Text
              className="text-sm text-muted-foreground"
              style={{ textTransform: "capitalize" }}
            >
              {book.difficulty}
            </Text>
          </View>
        </View>
      </Card>
    </Pressable>
  );
};
