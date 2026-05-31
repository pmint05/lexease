import { Text } from "@/src/components/ui/text";
import { ToggleGroup, ToggleGroupItem } from "@/src/components/ui/toggle-group";
import { cn } from "@/src/lib/utils";
import {
  AnalyticsRange,
  useAnalyticsStore,
} from "@/src/store/useAnalyticsStore";
import React from "react";
import { View } from "react-native";

export default function RangeSelector({ className }: { className?: string }) {
  const range = useAnalyticsStore((s) => s.range);
  const setRange = useAnalyticsStore((s) => s.setRange);

  return (
    <View
      className={cn(
        "bg-muted/10 p-1 rounded-xl border border-border/40",
        className,
      )}
    >
      <ToggleGroup
        type="single"
        value={range}
        onValueChange={(val) => val && setRange(val as AnalyticsRange)}
        variant="default"
        size={"sm"}
      >
        <ToggleGroupItem
          size="sm"
          value="week"
          className="px-3 h-8 rounded-lg"
          isFirst
        >
          <Text className="font-bold">Tuần</Text>
        </ToggleGroupItem>
        <ToggleGroupItem
          size="sm"
          value="month"
          className="px-3 h-8 rounded-lg"
          isLast
        >
          <Text className="font-bold">Tháng</Text>
        </ToggleGroupItem>
      </ToggleGroup>
    </View>
  );
}
