import { Card } from "@/src/components/ui/card";
import { Text } from "@/src/components/ui/text";
import { COLORS } from "@/src/core/constants/colors";
import { BarChart3, TrendingUp, Users } from "lucide-react-native";
import React from "react";
import { ScrollView, View } from "react-native";

/**
 * Report Screen
 * Detailed analytics and weekly summaries for children
 */
export default function ReportScreen(): React.ReactElement {
  return (
    <ScrollView contentContainerStyle={{ paddingVertical: 16 }}>
      <View className="px-4 gap-4">
        <View className="flex-row items-center gap-2 mb-2">
          <BarChart3 size={24} color="#0066CC" />
          <Text className="text-2xl font-bold">Thống kê chi tiết</Text>
        </View>

        <Card className="p-4 bg-background">
          <View className="gap-2">
            <View className="flex-row justify-between items-center">
              <Text className="font-bold text-lg">Tóm tắt tuần này</Text>
              <TrendingUp size={20} color={COLORS.success} />
            </View>
            <Text className="text-muted">
              Tiến độ đọc của các con đã tăng 15% so với tuần trước.
            </Text>
          </View>
        </Card>

        <View className="gap-3">
          <Text className="font-bold text-lg">Hoạt động của trẻ</Text>
          <Card className="p-4">
            <View className="flex-row gap-3 items-center">
              <Users size={24} color="#0066CC" />
              <View>
                <Text className="font-semibold">Bé An</Text>
                <Text className="text-sm text-muted">
                  Đã hoàn thành 5 cuốn sách tuần này
                </Text>
              </View>
            </View>
          </Card>

          <Card className="p-4">
            <View className="flex-row gap-3 items-center">
              <Users size={24} color="#0066CC" />
              <View>
                <Text className="font-semibold">Bé Bình</Text>
                <Text className="text-sm text-muted">
                  Cần cải thiện tốc độ đọc ở mức Trung bình
                </Text>
              </View>
            </View>
          </Card>
        </View>
      </View>
    </ScrollView>
  );
}
