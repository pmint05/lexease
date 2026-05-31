import { Card } from "@/src/components/ui/card";
import { Text } from "@/src/components/ui/text";
import { useEffectiveTheme } from "@/src/hooks/useEffectiveTheme";
import React from "react";
import { BarChart } from "react-native-gifted-charts";

type DataPoint = { x: string; subLabel?: string; y: number };

type Props = {
  data: DataPoint[];
  color?: string;
};

export default function WeeklyActivityChart({ data, color }: Props) {
  const { theme } = useEffectiveTheme();
  const barColor = color ?? theme.primary;

  if (!data.length) {
    return (
      <Card className="p-4">
        <Text className="text-sm text-muted-foreground">
          Chưa có dữ liệu hoạt động tuần này.
        </Text>
      </Card>
    );
  }

  const allZero = data.every((d) => d.y === 0);

  if (allZero) {
    return (
      <Card className="p-4">
        <Text className="text-sm text-muted-foreground">
          Tuần này chưa có bài học nào được ghi nhận.
        </Text>
      </Card>
    );
  }

  const barData = data.map((item) => ({
    value: item.y,
    label: item.x,
    frontColor: barColor,
    labelTextStyle: { color: theme.mutedForeground, fontSize: 10 },
  }));

  return (
    <Card className="p-4 overflow-hidden items-center">
      <BarChart
        data={barData}
        barWidth={18}
        noOfSections={3}
        barBorderRadius={4}
        frontColor={barColor}
        yAxisThickness={0}
        xAxisThickness={0}
        hideRules
        yAxisTextStyle={{ color: theme.mutedForeground, fontSize: 10 }}
        xAxisLabelTextStyle={{ color: theme.mutedForeground, fontSize: 10 }}
        isAnimated
        animationDuration={800}
      />
    </Card>
  );
}
