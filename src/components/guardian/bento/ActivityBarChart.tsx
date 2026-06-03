import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Text } from "@/src/components/ui/text";
import { useEffectiveTheme } from "@/src/hooks/useEffectiveTheme";
import React, { useMemo } from "react";
import { Dimensions, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";

interface ActivityData {
  label: string;
  value: number;
  frontColor?: string;
}

interface ActivityBarChartProps {
  data: ActivityData[];
  title?: string;
  description?: string;
}

const SCREEN_WIDTH = Dimensions.get("window").width;
const CARD_PADDING = 32; // Standard padding for the card container
const CHART_CONTAINER_WIDTH = SCREEN_WIDTH - CARD_PADDING;

export default function ActivityBarChart({
  data,
  title = "Tần suất luyện tập",
  description = "Số phút bé đọc mỗi ngày",
}: ActivityBarChartProps) {
  const { theme } = useEffectiveTheme();

  const { barData, config } = useMemo(() => {
    if (!data) return { barData: [], config: { barWidth: 22, spacing: 15 } };

    const isMonth = data.length > 10;
    
    // Calculate optimal bar width and spacing
    let barWidth = 22;
    let spacing = 18;

    if (!isMonth) {
      // For weekly view, try to distribute bars evenly
      const availableWidth = CHART_CONTAINER_WIDTH - 60; // Subtract Y-axis space
      spacing = (availableWidth - (data.length * barWidth)) / (data.length + 1);
      if (spacing < 10) {
        barWidth = 18;
        spacing = (availableWidth - (data.length * barWidth)) / (data.length + 1);
      }
    } else {
      // For monthly view, fixed width and allow scrolling
      barWidth = 14;
      spacing = 12;
    }

    const mappedData = data.map((item) => ({
      value: item.value || 0,
      label: item.label,
      frontColor: item.frontColor || theme.primary,
      topLabelComponent: () => (
        <Text className="text-[8px] text-muted-foreground w-full text-center mb-1">
          {item.value > 0 ? Math.round(item.value) : ""}
        </Text>
      ),
    }));

    return { barData: mappedData, config: { barWidth, spacing } };
  }, [data, theme.primary]);

  if (!data || data.length === 0) {
    return (
      <Card className="border-border/50 overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </CardHeader>
        <CardContent className="py-10 items-center justify-center">
          <Text className="text-muted-foreground italic text-center">
            Chưa có dữ liệu hoạt động.
          </Text>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Text className="text-[10px] text-muted-foreground">{description}</Text>
      </CardHeader>
      <CardContent className="pb-2 pt-4 pl-0">
        <View className="items-center w-full">
          <BarChart
            key={`bar-chart-${data.length}`}
            data={barData}
            barWidth={config.barWidth}
            spacing={config.spacing}
            height={160}
            noOfSections={3}
            barBorderRadius={6}
            frontColor={theme.primary}
            yAxisThickness={0}
            xAxisThickness={1}
            yAxisColor={theme.border}
            xAxisColor={theme.border}
            hideRules
            yAxisTextStyle={{ color: theme.mutedForeground, fontSize: 9 }}
            xAxisLabelTextStyle={{ 
              color: theme.mutedForeground, 
              fontSize: 9,
              textAlign: 'center',
            }}
            isAnimated
            animationDuration={800}
            maxValue={Math.max(...barData.map(d => d.value), 10) * 1.2}
            width={CHART_CONTAINER_WIDTH - 40}
            hideYAxisText={false}
            initialSpacing={15}
          />
        </View>
      </CardContent>
    </Card>
  );
}
