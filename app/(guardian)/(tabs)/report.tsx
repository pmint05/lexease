import { Card } from "@/src/components/ui/card";
import { Text } from "@/src/components/ui/text";
import { useEffectiveTheme } from "@/src/hooks/useEffectiveTheme";
import { BarChart3, TrendingUp, Users } from "lucide-react-native";
import React from "react";
import { ScrollView, View } from "react-native";

/**
 * Report Screen
 * Detailed analytics and weekly summaries for children
 */
export default function ReportScreen(): React.ReactElement {
  const { theme } = useEffectiveTheme();

  return (
    <View className="flex-1 bg-background px-4">
      <ScrollView className="flex-1" contentContainerClassName="gap-4 py-4">
        <View className="gap-4">
          <View className="mb-2 flex-row items-center gap-2">
            <BarChart3 size={24} color={theme.primary} />
            <Text className="text-2xl font-bold">Thống kê chi tiết</Text>
          </View>

          <Card className="p-4">
            <View className="gap-2">
              <View className="flex-row items-center justify-between">
                <Text className="text-lg font-bold">Tóm tắt tuần này</Text>
                <TrendingUp size={20} color={theme.accent} />
              </View>
              <Text className="text-muted-foreground">
                Tiến độ đọc của các con đã tăng 15% so với tuần trước.
              </Text>
            </View>
          </Card>

          <View className="gap-3">
            <Text className="text-lg font-bold">Hoạt động của trẻ</Text>
            <Card className="p-4">
              <View className="flex-row items-center gap-3">
                <Users size={24} color={theme.primary} />
                <View>
                  <Text className="font-semibold">Bé An</Text>
                  <Text className="text-sm text-muted-foreground">
                    Đã hoàn thành 5 cuốn sách tuần này
                  </Text>
                </View>
              </View>
            </Card>

            <Card className="p-4">
              <View className="flex-row items-center gap-3">
                <Users size={24} color={theme.primary} />
                <View>
                  <Text className="font-semibold">Bé Bình</Text>
                  <Text className="text-sm text-muted-foreground">
                    Cần cải thiện tốc độ đọc ở mức Trung bình
                  </Text>
                </View>
              </View>
            </Card>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
