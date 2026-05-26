import { LearningSession } from "@/src/core/types/learning";
import { ChevronRight } from "lucide-react-native";
import React from "react";
import { ListItem, Text, View, XStack, YStack } from "tamagui";

type Props = {
  sessions: LearningSession[];
  onPressSession?: (session: LearningSession) => void;
};

export default function RecentActivityList({
  sessions,
  onPressSession,
}: Props) {
  if (sessions.length === 0) {
    return (
      <View style={{ marginTop: 8 }}>
        <Text style={{ fontSize: 14, fontWeight: "700", marginBottom: 8 }}>
          Hoạt động gần đây
        </Text>
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 8,
            padding: 12,
            borderWidth: 1,
            borderColor: "#F2F2F2",
          }}
        >
          <Text style={{ fontSize: 13, color: "#777" }}>
            Chưa có hoạt động gần đây để hiển thị.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ marginTop: 12 }}>
      <Text fontSize={16} fontWeight="700" marginBottom={8}>
        Hoạt động gần đây
      </Text>

      <YStack gap="$2">
        {sessions.map((item) => (
          <ListItem
            key={item.id}
            onPress={() => onPressSession?.(item)}
            backgroundColor="$background"
            borderWidth={1}
            borderColor="$borderColor"
            borderRadius="$4"
            padding="$3"
          >
            <XStack flex={1} alignItems="center" justifyContent="space-between">
              <YStack flex={1} gap="$1">
                <Text fontSize={15} fontWeight="700">
                  {item.bookTitle}
                </Text>
                <Text fontSize={12} color="$gray10">
                  {new Date(item.completedAt).toLocaleString()}
                </Text>
                <Text fontSize={12} color="$gray10">
                  {Math.round(item.durationMs / 60000)} phút • {item.wordsRead}{" "}
                  từ
                </Text>
              </YStack>
              <ChevronRight size={16} color="#8A8A8A" />
            </XStack>
          </ListItem>
        ))}
      </YStack>
    </View>
  );
}
