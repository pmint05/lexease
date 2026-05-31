import { AudioPlaybackModal } from "@/src/components/child/AudioPlaybackModal";
import { RecordingTile } from "@/src/components/child/RecordingTile";
import { Button } from "@/src/components/shared/Button";
import { Badge } from "@/src/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Text } from "@/src/components/ui/text";
import { getApiBaseUrl } from "@/src/data/api/apiClient";
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
import { useState } from "react";
import { ScrollView, View } from "react-native";

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

  const [playbackUri, setPlaybackUri] = useState<string | null>(null);
  const [playbackTitle, setPlaybackTitle] = useState("");
  const [playbackMeteringData, setPlaybackMeteringData] = useState<
    number[] | undefined
  >([]);
  const [isPlaybackOpen, setIsPlaybackOpen] = useState(false);

  const session = data?.session;
  const recordings = data?.recordings ?? [];

  const handlePlaybackOpenChange = (nextOpen: boolean) => {
    setIsPlaybackOpen(nextOpen);
    if (!nextOpen) {
      setPlaybackUri(null);
      setPlaybackTitle("");
      setPlaybackMeteringData([]);
    }
  };

  const handleOpenPlayback = (recording: any) => {
    setPlaybackUri(recording.filePath);
    setPlaybackTitle(recording.bookTitle);
    setPlaybackMeteringData(recording.meteringData);
    setIsPlaybackOpen(true);
  };

  const fixAudioUrl = (url?: string | null): string => {
    if (!url) return "";
    const baseUrl = getApiBaseUrl();
    try {
      const apiOrigin = new URL(baseUrl).origin;
      if (url.includes("localhost:8080")) {
        return url.replace("http://localhost:8080", apiOrigin);
      }
    } catch (e) {
      // Ignore
    }
    return url;
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-background px-4 pt-4">
        <View className="flex-row justify-between items-center mb-4">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-8 w-20" />
        </View>

        <Skeleton className="h-40 w-full rounded-xl mb-4" />

        <View className="flex-row gap-3 mb-4">
          <Skeleton className="h-12 flex-1" />
          <Skeleton className="h-12 flex-1" />
          <Skeleton className="h-12 flex-1" />
        </View>

        <View className="mt-2">
          <Skeleton className="h-6 w-48 mb-3" />
          <Skeleton className="h-12 w-full mb-2" />
          <Skeleton className="h-12 w-full mb-2" />
        </View>
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
          onPress={() =>
            router.canGoBack()
              ? router.back()
              : router.push("/(guardian)/(tabs)/dashboard")
          }
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
                <View className="items-end gap-1">
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
                  {session.latestEvaluationStatus && (
                    <Badge variant="outline" className="border-primary/30">
                      <Text className="text-[8px] font-medium text-primary">
                        AI: {session.latestEvaluationStatus}
                      </Text>
                    </Badge>
                  )}
                </View>
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
                <View className="flex-row items-center gap-1.5">
                  <Text className="text-sm text-muted-foreground font-medium">
                    Từ: {session.currentWordIndex}
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
                  Các bản ghi âm ({session.recordingCount ?? recordings.length})
                </Text>
              </View>
            </View>

            {recordings.length > 0 ? (
              recordings.map((recording) => (
                <View key={recording.id} className="gap-2">
                  <RecordingTile
                    recording={
                      {
                        id: recording.id,
                        bookId: session.storyId,
                        childId: recording.childId,
                        bookTitle: session.storyTitle || "LexEase Story",
                        filePath: fixAudioUrl(recording.audioUrl),
                        durationMs: recording.durationMs,
                        createdAt: recording.createdAt,
                        accuracy: recording.evaluation?.scores?.accuracy ?? 0,
                        meteringData: recording.meteringData,
                      } as any
                    }
                    onPlay={handleOpenPlayback}
                  />
                  {recording.evaluation && (
                    <Card className="border-l-4 border-l-primary/40 bg-muted/5 border-border">
                      <CardContent className="p-3">
                        {recording.evaluation.summary && (
                          <View className="mb-2">
                            <Text className="text-xs font-bold text-primary mb-0.5">
                              Nhận xét AI:
                            </Text>
                            <Text className="text-foreground italic">
                              "{recording.evaluation.summary}"
                            </Text>
                          </View>
                        )}

                        <View className="flex-row flex-wrap gap-1 mt-1">
                          {recording.evaluation.words?.map((wordData, wIdx) => {
                            const isCorrect = wordData.correct;
                            const isMissing = wordData.errorType === "missing";
                            return (
                              <Text
                                key={wIdx}
                                className={cn(
                                  isCorrect
                                    ? "text-emerald-600"
                                    : isMissing
                                      ? "text-muted-foreground line-through"
                                      : "text-amber-600 font-bold",
                                )}
                              >
                                {wordData.expected}
                              </Text>
                            );
                          })}
                        </View>

                        {recording.evaluation.difficultWords &&
                          recording.evaluation.difficultWords.length > 0 && (
                            <View className="flex-row gap-2 mt-2">
                              <Text className="text-amber-700 font-bold whitespace-nowrap">
                                Từ khó:
                              </Text>
                              <Text className="text-amber-700 font-medium">
                                {recording.evaluation.difficultWords.join(", ")}
                              </Text>
                            </View>
                          )}
                      </CardContent>
                    </Card>
                  )}
                </View>
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
        </View>
      </ScrollView>

      {(isPlaybackOpen || playbackUri) && (
        <AudioPlaybackModal
          uri={playbackUri}
          title={playbackTitle}
          meteringData={playbackMeteringData}
          open={isPlaybackOpen}
          onOpenChange={handlePlaybackOpenChange}
        />
      )}
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
