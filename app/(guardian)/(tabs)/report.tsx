import { Badge } from "@/src/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Separator } from "@/src/components/ui/separator";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Text } from "@/src/components/ui/text";
import { useEffectiveTheme } from "@/src/hooks/useEffectiveTheme";
import { useGuardianChildLinksQuery } from "@/src/hooks/useFamilyQueries";
import {
  useDifficultWordsQuery,
  useProgressSummaryQuery,
} from "@/src/hooks/useProgressQueries";
import { cn } from "@/src/lib/utils";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useFamilyStore } from "@/src/store/useFamilyStore";
import {
  Activity,
  AlertCircle,
  BarChart3,
  BrainCircuit,
  Clock,
  Info,
  Star,
  TrendingUp,
} from "lucide-react-native";
import React, { useMemo } from "react";
import { ScrollView, View } from "react-native";

/**
 * Report Screen
 * Detailed analytics and weekly summaries for children
 */
export default function ReportScreen(): React.ReactElement {
  const { theme } = useEffectiveTheme();
  const { user } = useAuthStore();
  const guardianId = user?.id ?? "";

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

  const isLoading = summaryQuery.isLoading || difficultWordsQuery.isLoading;

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
        contentContainerClassName="pb-10"
      >
        <View className="gap-4">
          <View className="mb-2 flex-row items-center justify-between pt-4">
            <View className="flex-row items-center gap-2">
              <BarChart3 size={24} className="text-primary" />
              <Text className="text-2xl font-bold">Thống kê tiến độ</Text>
            </View>
            <Badge variant="outline" className="border-primary/20">
              <Text className="text-primary font-bold">
                {selectedChildName}
              </Text>
            </Badge>
          </View>

          {isLoading ? (
            <View className="gap-4">
              <View className="flex-row items-center justify-between pt-2">
                <Skeleton className="h-7 w-52 rounded-full" />
                <Skeleton className="h-7 w-24 rounded-full" />
              </View>

              <Card className="border-border bg-card shadow-sm">
                <CardContent className="gap-4 p-5">
                  <View className="flex-row gap-4">
                    <Skeleton className="h-20 flex-1 rounded-xl" />
                    <Skeleton className="h-20 flex-1 rounded-xl" />
                  </View>

                  <View className="gap-3">
                    <View className="flex-row gap-3">
                      <Skeleton className="h-16 flex-1 rounded-xl" />
                      <Skeleton className="h-16 flex-1 rounded-xl" />
                    </View>
                    <View className="flex-row gap-3">
                      <Skeleton className="h-16 flex-1 rounded-xl" />
                      <Skeleton className="h-16 flex-1 rounded-xl" />
                    </View>
                  </View>

                  <Skeleton className="h-28 w-full rounded-xl" />
                </CardContent>
              </Card>

              <View className="gap-3 mt-2">
                <Skeleton className="h-6 w-56 rounded-full" />
                <Card className="border-border">
                  <CardContent className="p-5">
                    <View className="flex-row flex-wrap gap-2">
                      <Skeleton className="h-8 w-24 rounded-full" />
                      <Skeleton className="h-8 w-20 rounded-full" />
                      <Skeleton className="h-8 w-28 rounded-full" />
                      <Skeleton className="h-8 w-24 rounded-full" />
                      <Skeleton className="h-8 w-16 rounded-full" />
                    </View>
                  </CardContent>
                </Card>
              </View>

              <View className="mt-2 bg-muted/10 rounded-2xl p-4 border border-border/40 gap-3">
                <Skeleton className="h-5 w-40 rounded-full" />
                <Skeleton className="h-4 w-full rounded-full" />
                <Skeleton className="h-4 w-5/6 rounded-full" />
                <Skeleton className="h-4 w-2/3 rounded-full" />
              </View>
            </View>
          ) : (
            <>
              {/* Weekly Summary */}
              <Card className="border-border bg-card shadow-sm">
                <CardHeader className="pb-2">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-2">
                      <TrendingUp size={20} className="text-accent" />
                      <CardTitle className="text-lg">
                        Tóm tắt tuần này
                      </CardTitle>
                    </View>
                    <Badge variant="secondary">
                      <Text className="text-[10px] font-bold">LATEST</Text>
                    </Badge>
                  </View>
                </CardHeader>
                <CardContent className="gap-4">
                  <View className="flex-row gap-4">
                    <View className="flex-1 bg-muted/20 p-3 rounded-xl items-center border border-border/50">
                      <Text className="text-[10px] text-muted-foreground uppercase font-bold">
                        Số buổi
                      </Text>
                      <Text className="text-2xl font-black text-foreground mt-1">
                        {summaryQuery.data?.completedSessionsCount ?? 0}
                      </Text>
                    </View>
                    <View className="flex-1 bg-muted/20 p-3 rounded-xl items-center border border-border/50">
                      <Text className="text-[10px] text-muted-foreground uppercase font-bold">
                        Tổng phút
                      </Text>
                      <Text className="text-2xl font-black text-foreground mt-1">
                        {summaryQuery.data?.totalPracticeMinutes ?? 0}
                      </Text>
                    </View>
                  </View>

                  {/* Detailed Metrics Grid */}
                  <View className="gap-3">
                    <View className="flex-row gap-3">
                      <MetricBox
                        label="Trôi chảy"
                        value={`${Math.round((summaryQuery.data?.averageFluency ?? 0) * 100)}%`}
                        icon={<Activity size={14} className="text-blue-500" />}
                      />
                      <MetricBox
                        label="Nhịp độ"
                        value={`${Math.round((summaryQuery.data?.averagePace ?? 0) * 100)}%`}
                        icon={<Clock size={14} className="text-orange-500" />}
                      />
                    </View>
                    <View className="flex-row gap-3">
                      <MetricBox
                        label="Lỗi trung bình"
                        value={`${(summaryQuery.data?.averageErrorsPerSession ?? 0).toFixed(1)}`}
                        icon={
                          <AlertCircle size={14} className="text-destructive" />
                        }
                      />
                      <MetricBox
                        label="Hỗ trợ TTS"
                        value={`${summaryQuery.data?.ttsHelpCount ?? 0}`}
                        icon={
                          <BrainCircuit size={14} className="text-primary" />
                        }
                      />
                    </View>
                  </View>

                  <View className="bg-accent/5 p-4 rounded-xl border border-accent/10">
                    <View className="flex-row items-center gap-2 mb-1">
                      <Star size={16} className="text-accent" />
                      <Text className="font-bold text-accent">
                        Đánh giá chung
                      </Text>
                    </View>
                    <Text className="text-sm text-muted-foreground leading-5">
                      Bé đạt độ chính xác trung bình{" "}
                      <Text className="font-bold text-foreground">
                        {Math.round(
                          (summaryQuery.data?.averageAccuracy ?? 0) * 100,
                        )}
                        %
                      </Text>{" "}
                      với tốc độ đọc{" "}
                      <Text className="font-bold text-foreground">
                        {Math.round(
                          summaryQuery.data?.averageReadingSpeedWpm ?? 0,
                        )}{" "}
                        từ/phút
                      </Text>
                      .
                      {summaryQuery.data?.trend.accuracy === "up"
                        ? " Độ chính xác đang có xu hướng tăng tốt!"
                        : " Hãy khuyến khích bé tập trung hơn nhé."}
                    </Text>
                  </View>
                </CardContent>
              </Card>

              {/* Difficult Words */}
              <View className="gap-3 mt-2">
                <View className="flex-row items-center gap-2 ml-1">
                  <BrainCircuit size={20} className="text-primary" />
                  <Text className="text-lg font-bold text-foreground">
                    Từ vựng cần lưu ý
                  </Text>
                </View>

                <Card className="border-border">
                  <CardContent className="p-5">
                    {difficultWordsQuery.data &&
                    difficultWordsQuery.data.length > 0 ? (
                      <View className="gap-4">
                        <Text className="text-sm text-muted-foreground">
                          Dưới đây là các từ mà bé thường xuyên phát âm chưa
                          chuẩn hoặc cần sự giúp đỡ của hệ thống:
                        </Text>
                        <View className="flex-row flex-wrap gap-2">
                          {difficultWordsQuery.data.map((item, index) => (
                            <Badge
                              key={index}
                              variant={
                                item.count > 3 ? "destructive" : "secondary"
                              }
                              className="px-3 py-1.5"
                            >
                              <Text className="font-bold">{item.word}</Text>
                              <Separator
                                orientation="vertical"
                                className="mx-2 h-3 bg-current opacity-20"
                              />
                              <Text className="text-[10px]">
                                {item.count} lần
                              </Text>
                            </Badge>
                          ))}
                        </View>
                      </View>
                    ) : (
                      <View className="items-center py-6">
                        <Info
                          size={32}
                          className="text-muted-foreground opacity-30 mb-2"
                        />
                        <Text className="text-muted-foreground italic text-center">
                          Tuyệt vời! Bé chưa gặp khó khăn{"\n"}với từ vựng nào
                          trong tháng này.
                        </Text>
                      </View>
                    )}
                  </CardContent>
                </Card>
              </View>

              {/* Weekly Trend Table (Simplified) */}
              <View className="mt-2 bg-muted/10 rounded-2xl p-4 border border-border/40">
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
    </View>
  );
}

function MetricBox({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <View className="flex-1 flex-row items-center justify-between bg-muted/10 p-3 rounded-xl border border-border/30">
      <View className="gap-1">
        <Text className="text-[10px] text-muted-foreground uppercase font-bold">
          {label}
        </Text>
        <Text className="text-lg font-black text-foreground">{value}</Text>
      </View>
      {icon}
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
