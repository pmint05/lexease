import { Text } from "@/src/components/ui/text";
import { ToggleGroup, ToggleGroupItem } from "@/src/components/ui/toggle-group";
import { useAnalyticsStore, AnalyticsRange } from "@/src/store/useAnalyticsStore";
import React from "react";
import { View } from "react-native";
import { cn } from "@/src/lib/utils";

export default function RangeSelector({ className }: { className?: string }) {
  const range = useAnalyticsStore((s) => s.range);
  const setRange = useAnalyticsStore((s) => s.setRange);

  return (
    <View className={cn("bg-muted/10 p-1 rounded-xl border border-border/40", className)}>
      <ToggleGroup
        type="single"
        value={range}
        onValueChange={(val) => val && setRange(val as AnalyticsRange)}
        variant="default"
      >
        <ToggleGroupItem value="week" className="px-3 h-8 rounded-lg" isFirst>
          <Text className="text-xs font-bold">Tuần</Text>
        </ToggleGroupItem>
        <ToggleGroupItem value="month" className="px-3 h-8 rounded-lg" isLast>
          <Text className="text-xs font-bold">Tháng</Text>
        </ToggleGroupItem>
      </ToggleGroup>
    </View>
  );
}
