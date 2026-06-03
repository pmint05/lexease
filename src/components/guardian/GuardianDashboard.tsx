import { useGuardianChildLinksQuery } from "@/src/hooks/useFamilyQueries";
import {
  useProgressSessionsQuery,
  useProgressSummaryQuery,
  useProgressTimeseriesQuery,
} from "@/src/hooks/useProgressQueries";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, View } from "react-native";
import { useAuthStore } from "../../store/useAuthStore";
import { useFamilyStore } from "../../store/useFamilyStore";
import { Skeleton } from "../ui/skeleton";
import { Text } from "../ui/text";
import RecentActivityList from "./RecentActivityListView";
import StatCard from "./StatCard";
import WeeklyActivityChart from "./WeeklyActivityChart";
import { getChildDisplayName } from "@/src/utils/formatters";

export default function GuardianDashboard() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const guardianId = user?.id ?? null;

  const selectedChildId = useFamilyStore((s) =>
    guardianId ? s.selectedChildByGuardian[guardianId] : null,
  );
  const setSelectedChild = useFamilyStore((s) => s.setSelectedChild);
  const linksQuery = useGuardianChildLinksQuery();

  const children = React.useMemo(() => {
    if (!guardianId) return [];

    return (linksQuery.data ?? [])
      .filter(
        (link) => link.guardianId === guardianId && link.status === "ACCEPTED",
      )
      .map((link) => ({
        childId: link.childId,
        childName: getChildDisplayName(link),
      }));
  }, [guardianId, linksQuery.data]);

  const targetChildId = selectedChildId ?? children[0]?.childId ?? "";

  const sessionsQuery = useProgressSessionsQuery(targetChildId);
  const summaryQuery = useProgressSummaryQuery(targetChildId);
  const timeseriesQuery = useProgressTimeseriesQuery(targetChildId);

  // If store lacks a selected child entry, ensure we set one
  React.useEffect(() => {
    if (guardianId && !selectedChildId && children.length > 0) {
      setSelectedChild(guardianId, children[0].childId);
    }
  }, [guardianId, selectedChildId, children, setSelectedChild]);

  const stats = React.useMemo(
    () => ({
      totalTimeMin: summaryQuery.data?.totalPracticeMinutes ?? 0,
      booksCompleted: summaryQuery.data?.completedSessionsCount ?? 0,
      totalSesions: (summaryQuery.data?.sessionsCount ?? 0).toString(),
    }),
    [summaryQuery.data, sessionsQuery.data],
  );

  const chartData = React.useMemo(() => {
    if (!timeseriesQuery.data) return [];

    return timeseriesQuery.data.map((item) => {
      const date = new Date(item.date);
      const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      return {
        x: dayNames[date.getDay()],
        subLabel: `${day}/${month}`,
        y: item.practiceMinutes,
      };
    });
  }, [timeseriesQuery.data]);

  const isLoading =
    summaryQuery.isLoading ||
    sessionsQuery.isLoading ||
    timeseriesQuery.isLoading;

  return (
    <View className="flex-1 bg-background px-4">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="gap-4 py-6"
      >
        {isLoading ? (
          <View className="gap-4">
            <View className="flex-row flex-wrap gap-3">
              <Skeleton className="h-28 flex-1 rounded-2xl" />
              <Skeleton className="h-28 flex-1 rounded-2xl" />
              <Skeleton className="h-28 flex-1 rounded-2xl" />
            </View>

            <View className="gap-3">
              <Skeleton className="h-5 w-48 rounded-full" />
              <Skeleton className="h-56 w-full rounded-2xl" />
            </View>

            <View className="gap-3">
              <Skeleton className="h-5 w-40 rounded-full" />
              <View className="gap-3">
                <Skeleton className="h-20 w-full rounded-2xl" />
                <Skeleton className="h-20 w-full rounded-2xl" />
                <Skeleton className="h-20 w-full rounded-2xl" />
              </View>
            </View>
          </View>
        ) : (
          <>
            <View className="flex-row flex-wrap gap-3">
              <StatCard
                title="Tổng"
                value={stats.totalSesions}
                subtitle="Phiên luyện tập"
              />
              <StatCard
                title="Đã hoàn thành"
                value={`${stats.booksCompleted}`}
                subtitle="Phiên luyện tập"
              />
              <StatCard
                title="Tổng"
                value={`${stats.totalTimeMin} phút`}
                subtitle="Luyện tập"
              />
            </View>

            <View className="gap-3">
              <Text className="text-base font-bold">Hoạt động luyện tập</Text>
              <WeeklyActivityChart data={chartData} />
            </View>

            <RecentActivityList
              sessions={(sessionsQuery.data ?? []).map((s) => ({
                id: s.sessionId,
                childId: targetChildId,
                bookId: s.storyId,
                bookTitle: s.storyTitle,
                startedAt: s.startedAt,
                completedAt: s.completedAt || s.startedAt,
                durationMs: s.elapsedMs,
                wordsRead: s.currentWordIndex,
                speed: s.readingSpeedWpm,
              }))}
              onPressSession={(session) => {
                router.push(`/(guardian)/session/${session.id}` as any);
              }}
            />
          </>
        )}
      </ScrollView>
    </View>
  );
}
