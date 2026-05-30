import { Text } from "@/src/components/ui/text";
import { useGuardianChildLinksQuery } from "@/src/hooks/useFamilyQueries";
import React from "react";
import { ScrollView, View } from "react-native";
import { useAuthStore } from "../../store/useAuthStore";
import { useFamilyStore } from "../../store/useFamilyStore";
import { useLearningStore } from "../../store/useLearningStore";
import DashboardHeader from "./DashboardHeader";
import RecentActivityList from "./RecentActivityListView";
import StatCard from "./StatCard";
import WeeklyActivityChart from "./WeeklyActivityChart";

export default function GuardianDashboard() {
  const user = useAuthStore((s) => s.user);
  const guardianId = user?.id ?? null;

  const getSelectedChildId = useFamilyStore((s) => s.getSelectedChildId);
  const setSelectedChild = useFamilyStore((s) => s.setSelectedChild);
  const linksQuery = useGuardianChildLinksQuery();

  const getSessionsForChild = useLearningStore((s) => s.getSessionsForChild);
  const getStatsForChild = useLearningStore((s) => s.getStatsForChild);
  const getWeeklyBucketsForChild = useLearningStore(
    (s) => s.getWeeklyBucketsForChild,
  );
  const ensureMockSeeded = useLearningStore((s) => s.ensureMockSeeded);

  const children = React.useMemo(() => {
    if (!guardianId) return [];

    return (linksQuery.data ?? [])
      .filter(
        (link) => link.guardianId === guardianId && link.status === "ACCEPTED",
      )
      .map((link) => ({
        childId: link.childId,
        childName: `Bé ${link.childId.slice(0, 8)}`,
      }));
  }, [guardianId, linksQuery.data]);
  const selectedChildId = guardianId ? getSelectedChildId(guardianId) : null;

  const selectedChild =
    children.find((c) => c.childId === selectedChildId) ?? children[0] ?? null;

  // If store lacks a selected child entry, ensure we set one
  React.useEffect(() => {
    if (guardianId && !selectedChildId && children.length > 0) {
      setSelectedChild(guardianId, children[0].childId);
    }
  }, [guardianId, selectedChildId, children, setSelectedChild]);

  React.useEffect(() => {
    ensureMockSeeded();
  }, [ensureMockSeeded]);

  const sessionsForChild = selectedChild
    ? getSessionsForChild(selectedChild.childId)
    : [];
  const stats = selectedChild
    ? getStatsForChild(selectedChild.childId)
    : { totalTimeMs: 0, booksCompleted: 0 };
  const weeklyData = selectedChild
    ? getWeeklyBucketsForChild(selectedChild.childId, 7)
    : [];

  const handleChildChange = React.useCallback(
    (childId: string | null) => {
      if (!guardianId || !childId) return;
      setSelectedChild(guardianId, childId);
    },
    [guardianId, setSelectedChild],
  );

  return (
    <View className="flex-1 bg-background px-4">
      <ScrollView className="flex-1" contentContainerClassName="gap-4 py-3">
        <DashboardHeader onChildChange={handleChildChange} />

        <View className="flex-row flex-wrap gap-3">
          <StatCard
            title="Tổng thời gian"
            value={`${Math.round(stats.totalTimeMs / 60000)} phút`}
            subtitle="Tổng học"
          />
          <StatCard
            title="Sách hoàn thành"
            value={`${stats.booksCompleted}`}
            subtitle="Số sách đã học"
          />
          <StatCard
            title="Phiên gần nhất"
            value={
              sessionsForChild[0]
                ? new Date(sessionsForChild[0].completedAt).toLocaleDateString()
                : "—"
            }
          />
        </View>

        <View className="gap-3">
          <Text className="text-base font-bold">Hoạt động theo tuần</Text>
          <WeeklyActivityChart data={weeklyData} />
        </View>

        <RecentActivityList
          sessions={sessionsForChild.slice(0, 20)}
          onPressSession={() => {}}
        />
      </ScrollView>
    </View>
  );
}
