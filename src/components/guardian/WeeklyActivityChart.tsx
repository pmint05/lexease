import { Card } from "@/src/components/ui/card";
import { Text } from "@/src/components/ui/text";
import { useEffectiveTheme } from "@/src/hooks/useEffectiveTheme";
import React from "react";
import { View } from "react-native";

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

  const barAreaHeight = 110;
  const max = Math.max(...data.map((d) => d.y), 1);
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

  return (
    <Card className="gap-4 p-4">
      <View className="h-[110px] flex-row items-end gap-1.5 overflow-hidden">
        {data.map((point, idx) => {
          const barHeight =
            point.y > 0 ? Math.max((point.y / max) * barAreaHeight, 8) : 0;
          return (
            <View
              key={`${point.x}-${idx}`}
              className="flex-1 items-center justify-end"
            >
              <View
                className="w-3/5 rounded-sm"
                style={{
                  height: barHeight,
                  maxHeight: barAreaHeight,
                  backgroundColor: barColor,
                }}
              />
            </View>
          );
        })}
      </View>

      <View className="flex-row gap-1.5">
        {data.map((point, idx) => {
          // Show label every 7 days for monthly view, or all labels for weekly
          const showLabel =
            data.length <= 8 ||
            (idx % 7 === 0 && data.length - idx > 3) ||
            idx === data.length - 1;

          return (
            <View
              key={`${point.x}-label-${idx}`}
              className="flex-1 items-center gap-0.5"
            >
              {showLabel ? (
                <>
                  <Text className="text-xs font-bold text-muted-foreground">
                    {point.x}
                  </Text>
                  {point.subLabel && (
                    <Text className="text-[9px] italic text-muted-foreground/60">
                      {point.subLabel}
                    </Text>
                  )}
                </>
              ) : (
                <View className="h-4" /> // Maintain spacing
              )}
            </View>
          );
        })}
      </View>
    </Card>
  );
}
