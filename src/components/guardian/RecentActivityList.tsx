import { Text } from "@/src/components/ui/text";
import { LearningSession } from "@/src/core/types/learning";
import { ChevronRight } from "lucide-react-native";
import React from "react";
import { Pressable, View } from "react-native";

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
        <Text className="font-semibold mb-2">Hoạt động gần đây</Text>
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 8,
            padding: 12,
            borderWidth: 1,
            borderColor: "#F2F2F2",
          }}
        >
          <Text className="text-sm text-muted-foreground">
            Chưa có hoạt động gần đây để hiển thị.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ marginTop: 12 }}>
      <Text className="font-semibold mb-2">Hoạt động gần đây</Text>

      <View className="flex-col gap-2">
        {sessions.map((item) => (
          <Pressable key={item.id} onPress={() => onPressSession?.(item)}>
            <View className="bg-background border border-border rounded-md p-3 flex-row items-center justify-between">
              <View style={{ flex: 1 }} className="gap-1">
                <Text className="font-semibold">{item.bookTitle}</Text>
                <Text className="text-sm text-muted-foreground">
                  {new Date(item.completedAt).toLocaleString()}
                </Text>
                <Text className="text-sm text-muted-foreground">
                  {Math.round(item.durationMs / 60000)} phút • {item.wordsRead}{" "}
                  từ
                </Text>
              </View>
              <ChevronRight size={16} color="#8A8A8A" />
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
