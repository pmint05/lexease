import React from "react";
import { ScrollView, Text, YStack, Card, XStack } from "tamagui";
import { COLORS } from "@/src/core/constants/colors";
import { BarChart3, TrendingUp, Users } from "lucide-react-native";

/**
 * Report Screen
 * Detailed analytics and weekly summaries for children
 */
export default function ReportScreen(): React.ReactElement {
  return (
    <ScrollView backgroundColor="$background" contentContainerStyle={{ paddingVertical: 16 }}>
      <YStack paddingHorizontal="$4" gap="$4">
        <XStack gap="$2" alignItems="center" marginBottom="$2">
          <BarChart3 size={24} color="$primary" />
          <Text fontSize="$6" fontWeight="700">Thống kê chi tiết</Text>
        </XStack>

        <Card padding="$4" bordered elevate backgroundColor="$background">
          <YStack gap="$2">
            <XStack justifyContent="space-between" alignItems="center">
              <Text fontWeight="700" fontSize="$5">Tóm tắt tuần này</Text>
              <TrendingUp size={20} color={COLORS.success} />
            </XStack>
            <Text color="$mutedForeground">
              Tiến độ đọc của các con đã tăng 15% so với tuần trước.
            </Text>
          </YStack>
        </Card>

        <YStack gap="$3">
          <Text fontWeight="700" fontSize="$5">Hoạt động của trẻ</Text>
          <Card padding="$4" bordered>
            <XStack gap="$3" alignItems="center">
              <Users size={24} color="$primary" />
              <YStack>
                <Text fontWeight="600">Bé An</Text>
                <Text fontSize="$3" color="$mutedForeground">Đã hoàn thành 5 cuốn sách tuần này</Text>
              </YStack>
            </XStack>
          </Card>
          
          <Card padding="$4" bordered>
            <XStack gap="$3" alignItems="center">
              <Users size={24} color="$primary" />
              <YStack>
                <Text fontWeight="600">Bé Bình</Text>
                <Text fontSize="$3" color="$mutedForeground">Cần cải thiện tốc độ đọc ở mức Trung bình</Text>
              </YStack>
            </XStack>
          </Card>
        </YStack>
      </YStack>
    </ScrollView>
  );
}
