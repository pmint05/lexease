import { Card } from "@/src/components/ui/card";
import { Text } from "@/src/components/ui/text";
import { Book } from "@/src/core/types";
import { Play } from "lucide-react-native";
import React from "react";
import { Image, Pressable, View } from "react-native";
import { Button } from "../ui/button";
import { Icon } from "../ui/icon";
// import { Button } from "../shared/Button";

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
    <Pressable onPress={() => onPress(book.id)}>
      <Card className="w-[300px] overflow-hidden mr-4 p-0">
        <View style={{ flex: 1 }} className="flex-row">
          <Image
            source={{ uri: book.coverUrl }}
            style={{ width: 120, height: "100%", borderRadius: 12 }}
            className="aspect-[2/3]"
          />
          <View
            style={{ flex: 1, justifyContent: "space-between" }}
            className="gap-2 p-4"
          >
            <View>
              <Text className="text-sm font-semibold uppercase tracking-wider">
                {book.category}
              </Text>
              <Text className="font-extrabold text-lg" numberOfLines={2}>
                {book.title}
              </Text>
              <Text className="text-muted-foreground text-sm" numberOfLines={1}>
                {book.author}
              </Text>
            </View>

            <Button onPress={() => onRead(book.id)} size={"sm"}>
              <Icon as={Play} className="size-4" />
              <Text>Đọc tiếp</Text>
            </Button>
          </View>
        </View>
      </Card>
    </Pressable>
  );
};
