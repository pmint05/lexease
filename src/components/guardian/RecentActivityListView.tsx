import { Text } from "@/src/components/ui/text";
import { LearningSession } from "@/src/core/types/learning";
import { formatDurationMs } from "@/src/utils/formatters";
import { ChevronRight } from "lucide-react-native";
import React from "react";
import { View } from "react-native";

type Props = {
  sessions: LearningSession[];
  onPressSession?: (session: LearningSession) => void;
};

export default function RecentActivityListView({
  sessions,
  onPressSession,
}: Props) {
  if (sessions.length === 0) {
    return (
      <View className="mt-4 gap-2">
        <Text className="font-semibold">Hoạt động gần đây</Text>
        <View className="rounded-2xl border border-border bg-card p-4">
          <Text className="text-sm text-muted-foreground">
            Chưa có hoạt động gần đây để hiển thị.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="mt-4 gap-2">
      <Text className="font-semibold">Hoạt động gần đây</Text>

      <View className="flex-col gap-2">
        {sessions.map((item) => (
          <View
            key={item.id}
            onTouchEnd={() => {
              if (onPressSession) {
                onPressSession(item);
              }
            }}
            className="rounded-2xl border border-border bg-card p-4"
          >
            <View className="flex-row items-center justify-between gap-3">
              <View className="flex-1 gap-1">
                <Text className="font-semibold">{item.bookTitle}</Text>
                <Text className="text-sm text-muted-foreground">
                  {new Date(item.completedAt).toLocaleString()}
                </Text>
                <Text className="text-sm text-muted-foreground">
                  {formatDurationMs(item.durationMs)} - {item.wordsRead} từ
                </Text>
              </View>
              <ChevronRight size={16} color="#8A8A8A" />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
