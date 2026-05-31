import { RecordingTile } from "@/src/components/child/RecordingTile";
import { Button } from "@/src/components/shared/Button";
import { Badge } from "@/src/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";
import { Text } from "@/src/components/ui/text";
import { useAudioRecording } from "@/src/hooks/useAudioRecording";
import { useProgressSessionDetailQuery } from "@/src/hooks/useProgressQueries";
import { cn } from "@/src/lib/utils";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useFamilyStore } from "@/src/store/useFamilyStore";
import { formatDurationMs } from "@/src/utils/formatters";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
    Activity,
    Calendar,
    CheckCircle2,
    ChevronLeft,
    Clock,
    Mic,
    Trophy,
    XCircle,
} from "lucide-react-native";
import { ActivityIndicator, ScrollView, View } from "react-native";

export default function SessionDetailScreen(): React.ReactElement {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuthStore();
  const guardianId = user?.id ?? "";

  const selectedChildId = useFamilyStore((state) =>
    guardianId ? state.getSelectedChildId(guardianId) : null,
  );

  const { data, isLoading } = useProgressSessionDetailQuery(
    selectedChildId ?? "",
    id ?? "",
  );
  const { playbackRecording } = useAudioRecording();

  const session = data?.session;
  const recordings = data?.recordings ?? [];

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center p-4 bg-background">
        <ActivityIndicator size="large" color="#FF6B00" />
        <Text className="text-muted-foreground mt-2">
          Đang tải chi tiết buổi học...
        </Text>
      </View>
    );
  }

  if (!session) {
    return (
      <View className="flex-1 justify-center items-center p-4 bg-background">
        <Text className="text-muted-foreground italic">
          Không tìm thấy thông tin buổi học.
        </Text>
        <Button className="mt-4" onPress={() => router.back()}>
          <Text>Quay lại</Text>
        </Button>
      </View>
    );
  }

  const accuracy = Math.round((session.latestAccuracy ?? 0) * 100);
  const durationFormatted = formatDurationMs(session.elapsedMs ?? 0);

  return (
    <View className="flex-1 bg-background px-4">
      <View className="flex-row justify-between items-center pt-4 mb-4">
        <Button
          variant="ghost"
          size="icon"
          onPress={() => router.back()}
          className="rounded-full bg-muted/30"
        >
          <ChevronLeft size={24} className="text-foreground" />
        </Button>
        <Text className="text-xl font-bold">Chi tiết buổi đọc</Text>
        <View className="w-10" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-10"
      >
        <View className="gap-4">
          {/* Summary Card */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <View className="flex-row justify-between items-start">
                <View className="flex-1">
                  <Text className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                    Tên truyện
                  </Text>
                  <Text className="text-xl font-bold text-foreground mt-0.5">
                    {session.storyTitle}
                  </Text>
                </View>
                <Badge
                  variant={
                    session.status === "COMPLETED" ? "default" : "secondary"
                  }
                >
                  <Text className="text-[10px] font-bold">
                    {session.status === "COMPLETED"
                      ? "HOÀN THÀNH"
                      : "CHƯA XONG"}
                  </Text>
                </Badge>
              </View>
            </CardHeader>
            <CardContent>
              <View className="flex-row items-center gap-4 mt-2">
                <View className="flex-row items-center gap-1.5">
                  <Calendar size={14} className="text-muted-foreground" />
                  <Text className="text-sm text-muted-foreground">
                    {new Date(session.startedAt).toLocaleDateString("vi-VN")}
                  </Text>
                </View>
                <View className="flex-row items-center gap-1.5">
                  <Clock size={14} className="text-muted-foreground" />
                  <Text className="text-sm text-muted-foreground">
                    {new Date(session.startedAt).toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </View>
              </View>

              <View className="flex-row gap-3 mt-6">
                <StatBox
                  icon={<Activity size={18} className="text-primary" />}
                  label="Tốc độ"
                  value={`${Math.round(session.readingSpeedWpm)}`}
                  unit="WPM"
                />
                <StatBox
                  icon={<Trophy size={18} className="text-accent" />}
                  label="Chính xác"
                  value={`${accuracy}`}
                  unit="%"
                />
                <StatBox
                  icon={<Clock size={18} className="text-blue-500" />}
                  label="Thời gian"
                  value={durationFormatted}
                  unit=""
                />
              </View>
            </CardContent>
          </Card>

          {/* Recordings Section */}
          <View className="gap-3 mt-2">
            <View className="flex-row items-center justify-between ml-1">
              <View className="flex-row items-center gap-2">
                <Mic size={20} className="text-primary" />
                <Text className="text-lg font-bold text-foreground">
                  Các bản ghi âm ({recordings.length})
                </Text>
              </View>
            </View>

            {recordings.length > 0 ? (
              recordings.map((recording) => (
                <RecordingTile
                  key={recording.id}
                  recording={
                    {
                      id: recording.id,
                      bookId: session.storyId,
                      childId: recording.childId,
                      title: recording?.createdAt
                        ? `Bản ghi ${new Date(recording.createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}`
                        : "Bản ghi chưa đặt tên",
                      filePath: recording.audioUrl,
                      durationMs: recording.durationMs,
                      createdAt: recording.createdAt,
                      accuracy: recording.evaluation?.scores?.accuracy ?? 0,
                    } as any
                  }
                  onPlay={async (item) => {
                    await playbackRecording(item.filePath);
                  }}
                />
              ))
            ) : (
              <Card className="p-10 items-center border-dashed">
                <Mic
                  size={32}
                  className="text-muted-foreground opacity-20 mb-2"
                />
                <Text className="text-muted-foreground italic text-center">
                  Không có bản ghi âm nào cho buổi học này.
                </Text>
              </Card>
            )}
          </View>

          {/* Summary/Feedback */}
          <Card className="bg-muted/10 border-border p-4">
            <Text className="font-bold text-foreground mb-2">
              Đánh giá hệ thống
            </Text>
            <View className="gap-2">
              <FeedbackRow
                label="Độ trôi chảy"
                score={session.latestAccuracy ?? 0}
              />
              <Text className="text-sm text-muted-foreground leading-5 mt-1">
                {accuracy > 80
                  ? "Bé đọc rất tốt và trôi chảy. Hãy duy trì phong độ này nhé!"
                  : "Bé còn vấp ở một số từ khó. Bạn có thể nghe lại các bản ghi âm để hỗ trợ con."}
              </Text>
            </View>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

function StatBox({
  icon,
  label,
  value,
  unit,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <View className="flex-1 bg-muted/20 p-3 rounded-2xl items-center border border-border/50">
      {icon}
      <Text className="text-[10px] text-muted-foreground uppercase font-bold mt-1">
        {label}
      </Text>
      <View className="flex-row items-baseline gap-0.5 mt-1">
        <Text className="text-xl font-black text-foreground">{value}</Text>
        <Text className="text-[10px] text-muted-foreground font-bold">
          {unit}
        </Text>
      </View>
    </View>
  );
}

function FeedbackRow({ label, score }: { label: string; score: number }) {
  const isGood = score > 0.7;
  return (
    <View className="flex-row items-center justify-between">
      <Text className="text-sm text-muted-foreground">{label}</Text>
      <View className="flex-row items-center gap-1.5">
        {isGood ? (
          <CheckCircle2 size={14} className="text-accent" />
        ) : (
          <XCircle size={14} className="text-destructive" />
        )}
        <Text
          className={cn(
            "text-sm font-bold",
            isGood ? "text-accent" : "text-destructive",
          )}
        >
          {isGood ? "Tốt" : "Cần cố gắng"}
        </Text>
      </View>
    </View>
  );
}
