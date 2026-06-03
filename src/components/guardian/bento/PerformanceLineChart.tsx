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
import { LineChart } from "react-native-gifted-charts";

interface TrendData {
  label: string;
  accuracy: number;
  speed: number;
}

interface PerformanceLineChartProps {
  data: TrendData[];
}

const SCREEN_WIDTH = Dimensions.get("window").width;
const CARD_PADDING = 32;
const CHART_CONTAINER_WIDTH = SCREEN_WIDTH - CARD_PADDING;

export default function PerformanceLineChart({
  data,
}: PerformanceLineChartProps) {
  const { theme } = useEffectiveTheme();

  const { accuracyData, speedData, config } = useMemo(() => {
    if (!data || data.length < 2)
      return {
        accuracyData: [],
        speedData: [],
        config: { spacing: 40, maxValue: 100 },
      };

    const isMonth = data.length > 10;
    const spacing = isMonth
      ? 30
      : (CHART_CONTAINER_WIDTH - 60) / (data.length - 1 || 1);

    // Find max value to add headroom (at least 20)
    const rawMax = Math.max(
      ...data.map((d) => d.accuracy),
      ...data.map((d) => d.speed),
      20
    );

    // Add 15% headroom and round up to the nearest 10 for clean sections
    const bufferedMax = Math.ceil((rawMax * 1.15) / 10) * 10;

    const acc = data.map((item) => ({
      value: item.accuracy,
      label: item.label,
      dataPointText: `${item.accuracy}%`,
    }));

    const speed = data.map((item) => ({
      value: item.speed,
      label: item.label,
      dataPointText: `${item.speed} WPM`,
    }));

    return {
      accuracyData: acc,
      speedData: speed,
      config: {
        spacing: Math.max(spacing, 30),
        maxValue: bufferedMax,
      },
    };
  }, [data]);

  if (!data || data.length < 2) {
    return (
      <Card className="border-border/50 overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Chỉ số phát triển
          </CardTitle>
        </CardHeader>
        <CardContent className="py-10 items-center justify-center">
          <Text className="text-muted-foreground italic text-center">
            Cần ít nhất 2 buổi học để xem xu hướng.
          </Text>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 overflow-hidden">
      <CardHeader className="pb-2">
        <View className="flex-row justify-between items-center">
          <View>
            <CardTitle className="text-sm font-medium">
              Chỉ số phát triển
            </CardTitle>
            <Text className="text-[10px] text-muted-foreground">
              Chính xác & Tốc độ
            </Text>
          </View>
          <View className="flex-row gap-3">
            <View className="flex-row items-center gap-1">
              <View className="w-2 h-2 rounded-full bg-accent" />
              <Text className="text-[10px] text-muted-foreground">
                Độ chính xác
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <View className="w-2 h-2 rounded-full bg-primary" />
              <Text className="text-[10px] text-muted-foreground">Tốc độ</Text>
            </View>
          </View>
        </View>
      </CardHeader>
      <CardContent className="pb-4 pt-6 pl-0">
        <View className="items-center w-full">
          <LineChart
            data={accuracyData}
            data2={speedData}
            height={140}
            maxValue={config.maxValue}
            width={CHART_CONTAINER_WIDTH - 50}
            noOfSections={4}
            spacing={config.spacing}
            initialSpacing={20}
            color1={theme.accent}
            color2={theme.primary}
            textColor1={theme.accent}
            dataPointsColor1={theme.accent}
            dataPointsColor2={theme.primary}
            curved
            hideDataPoints={data.length > 15}
            dataPointsRadius={3}
            hideRules
            yAxisThickness={0}
            xAxisThickness={1}
            yAxisColor={theme.border}
            xAxisColor={theme.border}
            yAxisTextStyle={{ color: theme.mutedForeground, fontSize: 9 }}
            xAxisLabelTextStyle={{
              color: theme.mutedForeground,
              fontSize: 9,
              textAlign: "center",
            }}
            // pointerConfig={{
            //   pointerStripUptoDataPoint: true,
            //   pointerStripColor: theme.border,
            //   pointerStripWidth: 1,
            //   strokeDashArray: [2, 4],
            //   pointerColor: theme.primary,
            //   radius: 4,
            //   pointerLabelComponent: (items: any) => {
            //     return (
            //       <View className="bg-foreground px-3 py-2 rounded-lg mb-2 shadow-sm border border-border/20">
            //         <Text className="text-background text-[10px] font-bold mb-1">
            //           {items[0].label}
            //         </Text>
            //         <View className="flex-row gap-3">
            //           <View className="flex-row items-center gap-1">
            //             <View className="w-1.5 h-1.5 rounded-full bg-accent" />
            //             <Text className="text-background text-[10px]">
            //               {items[0].value}%
            //             </Text>
            //           </View>
            //           <View className="flex-row items-center gap-1">
            //             <View className="w-1.5 h-1.5 rounded-full bg-primary" />
            //             <Text className="text-background text-[10px]">
            //               {items[1].value} WPM
            //             </Text>
            //           </View>
            //         </View>
            //       </View>
            //     );
            //   },
            // }}
          />
        </View>
      </CardContent>
    </Card>
  );
}
