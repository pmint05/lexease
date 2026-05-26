import React from "react";
import { ScrollView, Text, View } from "react-native";
import { useAuthStore } from "../../store/useAuthStore";
import { useFamilyStore } from "../../store/useFamilyStore";
import { useLearningStore } from "../../store/useLearningStore";
import DashboardHeader from "./DashboardHeader";
import RecentActivityList from "./RecentActivityList";
import StatCard from "./StatCard";
import WeeklyActivityChart from "./WeeklyActivityChart";

export default function GuardianDashboard() {
  const user = useAuthStore((s) => s.user);
  const guardianId = user?.id ?? null;

  const getChildrenForGuardian = useFamilyStore(
    (s) => s.getChildrenForGuardian,
  );
  const getSelectedChildId = useFamilyStore((s) => s.getSelectedChildId);
  const setSelectedChild = useFamilyStore((s) => s.setSelectedChild);
  const ensureDemoChildrenForGuardian = useFamilyStore(
    (s) => s.ensureDemoChildrenForGuardian,
  );

  const getSessionsForChild = useLearningStore((s) => s.getSessionsForChild);
  const getStatsForChild = useLearningStore((s) => s.getStatsForChild);
  const getWeeklyBucketsForChild = useLearningStore(
    (s) => s.getWeeklyBucketsForChild,
  );
  const ensureMockSeeded = useLearningStore((s) => s.ensureMockSeeded);

  const children = guardianId ? getChildrenForGuardian(guardianId) : [];
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

  React.useEffect(() => {
    if (guardianId) {
      ensureDemoChildrenForGuardian(guardianId);
    }
  }, [guardianId, ensureDemoChildrenForGuardian]);

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
    <ScrollView style={{ padding: 12 }}>
      <DashboardHeader onChildChange={handleChildChange} />

      <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 8 }}>
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

      <View style={{ marginTop: 12 }}>
        <Text style={{ fontSize: 16, fontWeight: "700", marginBottom: 8 }}>
          Hoạt động theo tuần
        </Text>
        <WeeklyActivityChart data={weeklyData} />
      </View>

      <RecentActivityList
        sessions={sessionsForChild.slice(0, 20)}
        onPressSession={() => {}}
      />
    </ScrollView>
  );
}
