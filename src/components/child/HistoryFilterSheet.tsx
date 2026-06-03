import { Button } from "@/src/components/ui/button";
import { Icon } from "@/src/components/ui/icon";
import { Text } from "@/src/components/ui/text";
import {
    CalendarDays,
    Clock3,
    Search,
    X,
    type LucideIcon,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Modal, Pressable, ScrollView, View } from "react-native";
import Animated, {
    Easing,
    interpolate,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

export type HistoryPeriodFilter = "all" | "7d" | "30d";
export type HistorySortOption =
  | "newest"
  | "oldest"
  | "longest"
  | "shortest"
  | "title-asc"
  | "title-desc";

const PERIOD_FILTERS: Array<{
  value: HistoryPeriodFilter;
  label: string;
}> = [
  { value: "all", label: "Tất cả" },
  { value: "7d", label: "7 ngày" },
  { value: "30d", label: "30 ngày" },
];

const SORT_OPTIONS: Array<{
  value: HistorySortOption;
  label: string;
  icon: LucideIcon;
}> = [
  { value: "newest", label: "Mới nhất", icon: Clock3 },
  { value: "oldest", label: "Cũ nhất", icon: Clock3 },
  { value: "longest", label: "Dài nhất", icon: Clock3 },
  { value: "shortest", label: "Ngắn nhất", icon: Clock3 },
  { value: "title-asc", label: "A-Z", icon: Search },
  { value: "title-desc", label: "Z-A", icon: Search },
];

export interface HistoryFilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  searchQuery: string;
  periodFilter: HistoryPeriodFilter;
  sortOption: HistorySortOption;
  filteredCount: number;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  onPeriodChange: (value: HistoryPeriodFilter) => void;
  onSortChange: (value: HistorySortOption) => void;
}

export function HistoryFilterSheet({
  open,
  onOpenChange,
  searchQuery,
  periodFilter,
  sortOption,
  filteredCount,
  hasActiveFilters,
  onClearFilters,
  onPeriodChange,
  onSortChange,
}: HistoryFilterSheetProps): React.ReactElement {
  const [rendered, setRendered] = useState(open);
  const progress = useSharedValue(open ? 1 : 0);
  const backdropStyle = useAnimatedStyle(() => {
    return {
      opacity: progress.value * 0.5,
    };
  });

  const sheetStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(progress.value, [0, 1], [450, 0]),
        },
      ],
      opacity: interpolate(progress.value, [0, 1], [0, 1]),
    };
  });

  useEffect(() => {
    if (open) {
      setRendered(true);
    }

    progress.value = withTiming(
      open ? 1 : 0,
      {
        duration: 240,
        easing: Easing.out(Easing.cubic),
      },
      (finished) => {
        if (!open && finished) {
          runOnJS(setRendered)(false);
        }
      },
    );
  }, [open, progress]);

  if (!rendered) {
    return <></>;
  }

  return (
    <Modal
      transparent
      visible={rendered}
      animationType="none"
      onRequestClose={() => onOpenChange(false)}
      statusBarTranslucent
    >
      <View className="flex-1 justify-end">
        <Animated.View
          style={backdropStyle}
          className="absolute inset-0 bg-black/50"
        >
          <Pressable className="flex-1" onPress={() => onOpenChange(false)} />
        </Animated.View>

        <Animated.View
          style={sheetStyle}
          className="w-full pb-6 pt-3 shadow-2xl shadow-black/20 px-5 bg-card rounded-t-3xl"
        >
          <View className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-border" />

          <View className="flex-row items-start justify-between gap-4 bg-card p-4 rounded-t-3xl pb-0">
            <View className="flex-1 gap-1">
              <Text className="text-xl font-bold">Bộ lọc lịch sử</Text>
              <Text className="text-sm text-muted-foreground">
                Chọn thời gian, cách sắp xếp và đặt lại bộ lọc khi cần.
              </Text>
            </View>

            <Button
              size="icon"
              variant="ghost"
              onPress={() => onOpenChange(false)}
            >
              <Icon as={X} size={18} />
            </Button>
          </View>

          <View className="gap-5 bg-card p-4">
            <View className="gap-2">
              <View className="flex-row items-center justify-between">
                <Text className="text-sm font-medium text-muted-foreground">
                  Từ khóa hiện tại
                </Text>
                <Text className="text-sm text-muted-foreground">
                  {searchQuery.trim().length > 0 ? searchQuery : "Tất cả"}
                </Text>
              </View>
            </View>

            <View className="gap-2">
              <Text className="text-sm font-medium text-muted-foreground">
                Lọc theo thời gian
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {PERIOD_FILTERS.map((item) => (
                  <Button
                    key={item.value}
                    size="sm"
                    variant={
                      periodFilter === item.value ? "default" : "outline"
                    }
                    onPress={() => onPeriodChange(item.value)}
                  >
                    <Icon as={CalendarDays} size={14} />
                    <Text className="text-sm font-semibold">{item.label}</Text>
                  </Button>
                ))}
              </View>
            </View>

            <View className="gap-2">
              <Text className="text-sm font-medium text-muted-foreground">
                Sắp xếp
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8, paddingRight: 8 }}
              >
                {SORT_OPTIONS.map((item) => {
                  const isActive = sortOption === item.value;

                  return (
                    <Button
                      key={item.value}
                      size="sm"
                      variant={isActive ? "default" : "outline"}
                      onPress={() => onSortChange(item.value)}
                    >
                      <Icon as={item.icon} size={14} />
                      <Text className="text-sm font-semibold">
                        {item.label}
                      </Text>
                    </Button>
                  );
                })}
              </ScrollView>
            </View>

            <View className="flex-row items-center justify-between rounded-xl bg-muted/40 px-3 py-2">
              <Text className="text-sm text-muted-foreground">
                {filteredCount} bản ghi
              </Text>
              {hasActiveFilters ? (
                <Text className="text-sm text-muted-foreground">
                  Đang áp dụng bộ lọc
                </Text>
              ) : null}
            </View>

            <View className="flex-row gap-2 bg-card">
              <Button
                variant="ghost"
                className="flex-1"
                onPress={onClearFilters}
              >
                <Icon as={X} size={14} />
                <Text className="text-sm font-semibold">Xóa bộ lọc</Text>
              </Button>
              <Button className="flex-1" onPress={() => onOpenChange(false)}>
                <Text className="text-sm font-semibold">Xong</Text>
              </Button>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
