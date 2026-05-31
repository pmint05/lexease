import { Text } from "@/src/components/ui/text";
import { LearningSession } from "@/src/core/types/learning";
import { ChevronRight, BookOpen, Clock, Activity } from "lucide-react-native";
import React from "react";
import { Pressable, View } from "react-native";
import { useRouter } from "expo-router";
import { formatDurationMs } from "@/src/utils/formatters";

type Props = {
  sessions: LearningSession[];
  onPressSession?: (session: LearningSession) => void;
};

export default function RecentActivityListView({
  sessions,
  onPressSession,
}: Props) {
  const router = useRouter();

  if (sessions.length === 0) {
    return (
      <View className="mt-4 gap-2">
        <Text className="text-base font-bold ml-1">Hoạt động gần đây</Text>
        <View className="rounded-2xl border border-dashed border-border bg-card/50 p-8 items-center">
          <Text className="text-sm text-muted-foreground italic">
            Chưa có hoạt động gần đây để hiển thị.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="mt-4 gap-3">
      <Text className="text-base font-bold ml-1">Hoạt động gần đây</Text>

      <View className="flex-col gap-3">
        {sessions.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => onPressSession?.(item)}
            className="rounded-2xl border border-border bg-card p-4 active:bg-muted/20 shadow-sm"
          >
            <View className="flex-row items-center gap-3">
              {/* Left: Book Icon/Entry */}
              <Pressable 
                onPress={(e) => {
                    e.stopPropagation();
                    router.push(`/(guardian)/book/${item.bookId}` as any);
                }}
                className="size-12 bg-primary/10 rounded-xl items-center justify-center border border-primary/5"
              >
                <BookOpen size={24} className="text-primary" />
              </Pressable>

              {/* Middle: Info */}
              <View className="flex-1 gap-1">
                <View className="flex-row justify-between items-start">
                    <Text className="font-bold text-base text-foreground leading-tight flex-1 mr-2" numberOfLines={1}>
                        {item.bookTitle}
                    </Text>
                    <Text className="text-[10px] text-muted-foreground font-medium uppercase bg-muted px-1.5 py-0.5 rounded">
                        {new Date(item.completedAt).toLocaleDateString("vi-VN", { day: '2-digit', month: '2-digit' })}
                    </Text>
                </View>

                <View className="flex-row items-center gap-3">
                    <View className="flex-row items-center gap-1">
                        <Clock size={12} className="text-muted-foreground" />
                        <Text className="text-xs text-muted-foreground">
                            {formatDurationMs(item.durationMs, true)}
                        </Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                        <Activity size={12} className="text-muted-foreground" />
                        <Text className="text-xs text-muted-foreground">
                            {Math.round(item.speed)} WPM
                        </Text>
                    </View>
                </View>
              </View>

              {/* Right: Arrow */}
              <ChevronRight size={18} className="text-muted-foreground/50" />
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
