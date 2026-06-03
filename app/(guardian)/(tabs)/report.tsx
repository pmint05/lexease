import { Badge } from "@/src/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Text } from "@/src/components/ui/text";
import { useEffectiveTheme } from "@/src/hooks/useEffectiveTheme";
import { useGuardianChildLinksQuery } from "@/src/hooks/useFamilyQueries";
import {
  useDifficultWordsQuery,
  useProgressSummaryQuery,
  useProgressTimeseriesQuery,
} from "@/src/hooks/useProgressQueries";
import { cn } from "@/src/lib/utils";
import { useAnalyticsStore } from "@/src/store/useAnalyticsStore";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useFamilyStore } from "@/src/store/useFamilyStore";
import {
  AlertCircle,
  BarChart3,
  BookOpen,
  ChevronRight,
  Info,
  Star,
  Target,
  Timer,
  TrendingUp,
  Zap,
} from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";

// Bento Components
import ActivityBarChart from "@/src/components/guardian/bento/ActivityBarChart";
import BentoStatCard from "@/src/components/guardian/bento/BentoStatCard";
import PerformanceLineChart from "@/src/components/guardian/bento/PerformanceLineChart";
import SkillProgressBars from "@/src/components/guardian/bento/SkillProgressBars";
import { DifficultWordsSheet } from "@/src/components/guardian/DifficultWordsSheet";
import { Icon } from "@/src/components/ui/icon";

/**
 * Report Screen
 * Redesigned Bento-style Dashboard for detailed child progress
 */
export default function ReportScreen(): React.ReactElement {
  const { theme } = useEffectiveTheme();
  const { user } = useAuthStore();
  const guardianId = user?.id ?? "";

  const { range, setRange } = useAnalyticsStore();

  const selectedChildId = useFamilyStore((state) =>
    guardianId ? state.getSelectedChildId(guardianId) : null,
  );

  const linksQuery = useGuardianChildLinksQuery();
  const acceptedLinks = useMemo(() => {
    return (linksQuery.data ?? []).filter((link) => link.status === "ACCEPTED");
  }, [linksQuery.data]);

  const targetChildId = selectedChildId ?? acceptedLinks[0]?.childId ?? "";
  const selectedChildName = useMemo(() => {
    const link = acceptedLinks.find((l) => l.childId === targetChildId);
    return link?.childEmail?.split("@")[0] || "Bé";
  }, [acceptedLinks, targetChildId]);

  const summaryQuery = useProgressSummaryQuery(targetChildId);
  const difficultWordsQuery = useDifficultWordsQuery(targetChildId);
  const timeseriesQuery = useProgressTimeseriesQuery(targetChildId);

  const [isWordsSheetOpen, setIsWordsSheetOpen] = useState(false);

  const isLoading =
    summaryQuery.isLoading ||
    difficultWordsQuery.isLoading ||
    timeseriesQuery.isLoading;

  const activityData = useMemo(() => {
    if (!timeseriesQuery.data) return [];
    return timeseriesQuery.data.map((item) => {
      const date = new Date(item.date);
      const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
      return {
        label:
          range === "month" ? `${date.getDate()}` : dayNames[date.getDay()],
        value: item.practiceMinutes || 0,
      };
    });
  }, [timeseriesQuery.data, range]);

  const trendData = useMemo(() => {
    if (!timeseriesQuery.data) return [];
    return timeseriesQuery.data.map((item) => {
      const date = new Date(item.date);
      return {
        label: `${date.getDate()}/${date.getMonth() + 1}`,
        accuracy: Math.round((item.averageAccuracy || 0) * 100),
        speed: Math.round(item.averageReadingSpeedWpm || 0),
      };
    });
  }, [timeseriesQuery.data]);

  if (!targetChildId) {
    return (
      <View className="flex-1 bg-background justify-center items-center px-6">
        <AlertCircle
          size={48}
          className="text-muted-foreground opacity-20 mb-4"
        />
        <Text className="text-center text-muted-foreground italic">
          Bạn cần liên kết với tài khoản của bé để xem báo cáo tiến độ.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background px-4">
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerClassName="pb-10 pt-4"
      >
        <View className="gap-6">
          {/* Header */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <BarChart3 size={24} className="text-primary" />
              <Text className="text-2xl font-bold">
                Báo cáo của {selectedChildName}
              </Text>
            </View>
          </View>

          {isLoading ? (
            <ReportSkeleton />
          ) : (
            <>
              {/* Bento Row 1: Quick Stats */}
              <View className="flex-row gap-3 h-[120px]">
                <BentoStatCard
                  className="flex-1"
                  title="Tổng thời gian"
                  value={`${summaryQuery.data?.totalPracticeMinutes ?? 0}m`}
                  icon={<Icon as={Timer} size={16} className="text-primary" />}
                  trend={{
                    value:
                      summaryQuery.data?.trend.practiceMinutes === "up"
                        ? "Tăng"
                        : summaryQuery.data?.trend.practiceMinutes === "down"
                          ? "Giảm"
                          : "Ổn định",
                    type: summaryQuery.data?.trend.practiceMinutes as
                      | "up"
                      | "down"
                      | "neutral",
                  }}
                />
                <BentoStatCard
                  className="flex-1"
                  title="Số buổi học"
                  value={summaryQuery.data?.completedSessionsCount ?? 0}
                  icon={
                    <Icon as={BookOpen} size={16} className="text-primary" />
                  }
                  trend={{ value: "Ổn định", type: "neutral" }}
                />
              </View>

              <View className="flex-row gap-3 h-[150px]">
                <BentoStatCard
                  className="flex-1"
                  title="Độ chính xác"
                  value={`${Math.round((summaryQuery.data?.averageAccuracy ?? 0) * 100)}%`}
                  icon={<Icon as={Target} size={16} className="text-primary" />}
                  trend={{
                    value:
                      summaryQuery.data?.trend.accuracy === "up"
                        ? "Tăng"
                        : summaryQuery.data?.trend.accuracy === "down"
                          ? "Giảm"
                          : "Ổn định",
                    type: summaryQuery.data?.trend.accuracy as
                      | "up"
                      | "down"
                      | "neutral",
                  }}
                />
                <BentoStatCard
                  className="flex-1"
                  title="Tốc độ đọc"
                  value={`${Math.round(summaryQuery.data?.averageReadingSpeedWpm ?? 0)}`}
                  subtitle="Từ/phút"
                  icon={<Icon as={Zap} size={16} className="text-orange-500" />}
                  trend={{
                    value:
                      summaryQuery.data?.trend.readingSpeed === "up"
                        ? "Tăng"
                        : summaryQuery.data?.trend.readingSpeed === "down"
                          ? "Giảm"
                          : "Ổn định",
                    type: summaryQuery.data?.trend.readingSpeed as
                      | "up"
                      | "down"
                      | "neutral",
                  }}
                />
              </View>

              {/* Bento Row 2: Charts */}
              <ActivityBarChart data={activityData} />

              <PerformanceLineChart data={trendData} />

              {/* Bento Row 3: Skills & Words */}
              <View className="flex-row gap-3 h-[220px]">
                <View className="flex-[1.2]">
                  <SkillProgressBars
                    fluency={summaryQuery.data?.averageFluency ?? 0}
                    pace={summaryQuery.data?.averagePace ?? 0}
                    accuracy={summaryQuery.data?.averageAccuracy ?? 0}
                  />
                </View>
                <View className="flex-1">
                  <DifficultWordsCard
                    data={difficultWordsQuery.data ?? []}
                    onPressMore={() => setIsWordsSheetOpen(true)}
                  />
                </View>
              </View>

              {/* Insights / AI Summary */}
              <Card className="border-border/50 overflow-hidden">
                <CardHeader className="pb-2">
                  <View className="flex-row items-center gap-2">
                    <Icon as={Star} size={16} className="!text-primary" />
                    <CardTitle className="text-sm font-bold text-primary">
                      Nhận xét từ hệ thống
                    </CardTitle>
                  </View>
                </CardHeader>
                <CardContent>
                  <Text className="text-sm text-muted-foreground leading-5">
                    Bé đang duy trì phong độ rất tốt với độ trôi chảy đạt{" "}
                    <Text className="font-bold text-foreground">
                      {Math.round(
                        (summaryQuery.data?.averageFluency ?? 0) * 100,
                      )}
                      %
                    </Text>
                    .
                    {summaryQuery.data?.trend.accuracy === "up"
                      ? " Khả năng phát âm chính xác của bé đã cải thiện rõ rệt so với tuần trước. Tiếp tục phát huy nhé!"
                      : " Bé nên tập trung hơn vào các từ vựng mới để nâng cao độ chính xác."}
                  </Text>
                </CardContent>
              </Card>

              {/* Trend Table */}
              <View className="bg-muted/10 rounded-2xl p-4 border border-border/40">
                <View className="flex-row justify-between items-center mb-4">
                  <Text className="font-bold text-foreground">
                    Chỉ số xu hướng
                  </Text>
                  <Info size={16} className="text-muted-foreground" />
                </View>
                <View className="gap-3">
                  <TrendItem
                    label="Thời gian luyện tập"
                    value={summaryQuery.data?.trend.practiceMinutes}
                  />
                  <TrendItem
                    label="Tốc độ đọc"
                    value={summaryQuery.data?.trend.readingSpeed}
                  />
                  <TrendItem
                    label="Độ chính xác"
                    value={summaryQuery.data?.trend.accuracy}
                  />
                  <TrendItem
                    label="Số lỗi phát âm"
                    value={summaryQuery.data?.trend.errors}
                    inverse
                  />
                </View>
              </View>
            </>
          )}
        </View>
      </ScrollView>

      {/* Difficult Words Details Sheet */}
      <DifficultWordsSheet
        open={isWordsSheetOpen}
        onOpenChange={setIsWordsSheetOpen}
        data={difficultWordsQuery.data ?? []}
      />
    </View>
  );
}

function DifficultWordsCard({
  data,
  onPressMore,
}: {
  data: any[];
  onPressMore: () => void;
}) {
  return (
    <Card className="border-border/50 h-full flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Từ cần lưu ý</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        {data.length > 0 ? (
          <View className="flex-1 justify-between">
            <View className="flex-row flex-wrap gap-1.5">
              {data.slice(0, 5).map((item, i) => (
                <Badge
                  key={i}
                  variant={item.count > 3 ? "destructive" : "secondary"}
                  className="px-2 py-0.5"
                >
                  <Text className="text-[10px] font-bold">{item.word}</Text>
                </Badge>
              ))}
              <Badge variant="outline" className="px-2 py-0.5">
                <Text className="text-[10px] font-bold">
                  +{data.length - 5} từ khác
                </Text>
              </Badge>
            </View>
            <Pressable
              onPress={onPressMore}
              className="mt-3 py-1.5 px-2 flex-row justify-center items-center gap-1 border !border-border/60 !bg-muted/20 rounded-lg active:bg-muted/50"
            >
              <Text className="text-xs font-semibold text-primary">
                Xem chi tiết
              </Text>
              <ChevronRight size={12} className="text-primary" />
            </Pressable>
          </View>
        ) : (
          <View className="items-center py-4 flex-1 justify-center">
            <Text className="text-[10px] text-muted-foreground italic text-center">
              Bé học rất tốt, không gặp từ khó nào!
            </Text>
          </View>
        )}
      </CardContent>
    </Card>
  );
}

function ReportSkeleton() {
  return (
    <View className="gap-4">
      <View className="flex-row gap-3">
        <Skeleton className="h-24 flex-1 rounded-2xl" />
        <Skeleton className="h-24 flex-1 rounded-2xl" />
      </View>
      <View className="flex-row gap-3">
        <Skeleton className="h-24 flex-1 rounded-2xl" />
        <Skeleton className="h-24 flex-1 rounded-2xl" />
      </View>
      <Skeleton className="h-56 w-full rounded-2xl" />
      <Skeleton className="h-64 w-full rounded-2xl" />
      <View className="flex-row gap-3">
        <Skeleton className="h-40 flex-1 rounded-2xl" />
        <Skeleton className="h-40 flex-1 rounded-2xl" />
      </View>
    </View>
  );
}

function TrendItem({
  label,
  value,
  inverse = false,
}: {
  label: string;
  value?: string;
  inverse?: boolean;
}) {
  const isUp = value === "up";
  const isDown = value === "down";
  const isNeutral = !isUp && !isDown;

  const getStatusColor = () => {
    if (isNeutral) return "text-muted-foreground";
    if (isUp) return inverse ? "text-destructive" : "text-accent";
    return inverse ? "text-accent" : "text-destructive";
  };

  const getStatusText = () => {
    if (isUp) return "Tăng";
    if (isDown) return "Giảm";
    return "Ổn định";
  };

  return (
    <View className="flex-row justify-between items-center">
      <Text className="text-sm text-muted-foreground">{label}</Text>
      <View className="flex-row items-center gap-1">
        <Text className={cn("text-sm font-bold", getStatusColor())}>
          {getStatusText()}
        </Text>
        {isUp && <TrendingUp size={14} className={getStatusColor()} />}
      </View>
    </View>
  );
}
