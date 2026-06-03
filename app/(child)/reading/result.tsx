import { useLocalSearchParams, useRouter } from "expo-router";
import {
  CaseSensitiveIcon,
  CheckCheck,
  Clock3,
  GaugeIcon,
  HeadphoneOffIcon,
  MicIcon,
  Repeat2,
  RotateCcwIcon,
} from "lucide-react-native";
import { useMemo, useState } from "react";
import { FlatList, View } from "react-native";

import { AudioPlaybackModal } from "@/src/components/child/AudioPlaybackModal";
import { RecordingTile } from "@/src/components/child/RecordingTile";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Icon } from "@/src/components/ui/icon";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Text } from "@/src/components/ui/text";
import { Recording } from "@/src/core/types";
import { useReadingSessionQuery } from "@/src/hooks/useReadingSessionQueries";
import { useRecordingStore } from "@/src/store/useRecordingStore";
import { formatReadingTime } from "@/src/utils/formatters";

type ResultParams = {
  sessionId?: string;
  storyId?: string;
};

function ResultMetric({
  title,
  icon,
  value,
  accentClassName,
}: {
  title: string;
  icon: React.ReactElement;
  value: string;
  accentClassName?: string;
}): React.ReactElement {
  return (
    <Card className="flex-1 gap-2 p-3">
      <View className="flex-row items-center gap-3">
        <View
          className={`h-10 w-10 items-center justify-center rounded-full ${accentClassName ?? "bg-primary/10"}`}
        >
          {icon}
        </View>
        <View className="flex-1">
          <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {title}
          </Text>
          <Text className="text-2xl font-extrabold leading-none">{value}</Text>
        </View>
      </View>
    </Card>
  );
}

export default function ReadingResultScreen(): React.ReactElement {
  const router = useRouter();
  const { sessionId, storyId } = useLocalSearchParams<ResultParams>();
  const sessionQuery = useReadingSessionQuery(sessionId);
  const { recordings, removeRecording, clearRecordingsBySession } =
    useRecordingStore();

  const [playbackUri, setPlaybackUri] = useState<string | null>(null);
  const [playbackTitle, setPlaybackTitle] = useState("");
  const [playbackMeteringData, setPlaybackMeteringData] = useState<
    number[] | undefined
  >([]);
  const [isPlaybackOpen, setIsPlaybackOpen] = useState(false);

  const sessionRecordings = useMemo(() => {
    if (!sessionId) return [];
    return recordings.filter((recording) => recording.sessionId === sessionId);
  }, [recordings, sessionId]);

  const handlePlaybackOpenChange = (nextOpen: boolean) => {
    setIsPlaybackOpen(nextOpen);
    if (!nextOpen) {
      setPlaybackUri(null);
      setPlaybackTitle("");
      setPlaybackMeteringData([]);
    }
  };

  const handleOpenPlayback = (recording: Recording) => {
    setPlaybackUri(recording.filePath);
    setPlaybackTitle(recording.bookTitle);
    setPlaybackMeteringData(recording.meteringData);
    setIsPlaybackOpen(true);
  };

  const handleDeleteRecording = (recordingId: string) =>
    removeRecording(recordingId);

  const handlePracticeAgain = async () => {
    if (sessionId) {
      clearRecordingsBySession(sessionId);
    }

    if (storyId) {
      router.replace({
        pathname: "/(child)/reading/[id]",
        params: { id: storyId, mode: "start" },
      });
    }
  };

  const handleComplete = () => {
    if (sessionRecordings.length > 0) {
      router.replace({
        pathname: "/(child)/reading/evaluation",
        params: { sessionId, storyId },
      });
    } else {
      if (sessionId) {
        clearRecordingsBySession(sessionId);
      }
      router.replace("/(child)/(tabs)/library");
    }
  };

  if (!sessionId) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <Text className="text-lg font-semibold text-center">
          Thiếu phiên đọc
        </Text>
        <Button
          className="mt-4"
          onPress={() => router.replace("/(child)/(tabs)/library")}
        >
          <Text>Về thư viện</Text>
        </Button>
      </View>
    );
  }

  if (sessionQuery.isLoading) {
    return (
      <View className="flex-1 bg-background px-4 pt-4">
        <Skeleton className="h-8 w-2/3 rounded-full" />
        <View className="mt-6 gap-3">
          <Skeleton className="h-24 rounded-3xl" />
          <Skeleton className="h-24 rounded-3xl" />
          <Skeleton className="h-24 rounded-3xl" />
        </View>
      </View>
    );
  }

  const backendSession = sessionQuery.data;
  const metrics = useMemo(() => {
    const elapsedMs = backendSession?.elapsedMs ?? 0;
    const wordsRead = backendSession?.resumePosition.wordIndex ?? 0;
    // Speed is usually calculated on backend or we can estimate it here
    // WPM = (wordsRead / (elapsedMs / 60000))
    const wpm = elapsedMs > 0 ? wordsRead / (elapsedMs / 60000) : 0;

    return {
      durationMs: elapsedMs,
      wordsRead,
      wpm: Math.round(wpm),
    };
  }, [backendSession]);

  const hasRecordings = sessionRecordings.length > 0;
  const isTooManyRecordings = sessionRecordings.length > 1;

  return (
    <View className="flex-1 bg-background">
      <FlatList
        data={sessionRecordings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 220, gap: 16 }}
        ListHeaderComponent={
          <View className="gap-4">
            <Card>
              <CardContent className="px-4 py-5">
                <View className="items-center gap-3">
                  <View className="h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Icon as={CheckCheck} className="size-8 text-primary" />
                  </View>
                  <Text className="text-3xl font-extrabold text-center">
                    Xong rồi
                  </Text>
                  <Text className="text-center text-muted-foreground">
                    {backendSession?.story.title ?? "Bài đọc"}
                  </Text>
                </View>
              </CardContent>
            </Card>

            <View className="gap-2">
              <View className="flex-row items-center gap-2">
                <Repeat2 className="size-4 text-muted-foreground" />
                <Text className="text-sm text-muted-foreground">
                  Chạm để nghe hoặc xóa bản ghi.
                </Text>
              </View>
              {isTooManyRecordings && (
                <View className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex-row items-center gap-3">
                  <View className="bg-amber-500 rounded-full p-1">
                    <MicIcon className="size-3 text-white" />
                  </View>
                  <Text className="text-xs text-amber-700 flex-1 font-medium">
                    Bé hãy chọn giữ lại{" "}
                    <Text className="font-black text-amber-900">
                      1 bản ghi tốt nhất
                    </Text>{" "}
                    để hệ thống chấm điểm nhé!
                  </Text>
                </View>
              )}
            </View>

            <View className="flex-row flex-wrap gap-3">
              <ResultMetric
                title="Thời gian"
                icon={<Clock3 className="size-5 text-primary" />}
                value={formatReadingTime(metrics.durationMs)}
                accentClassName="bg-primary/10"
              />
              <ResultMetric
                title="Số từ"
                icon={<CaseSensitiveIcon className="size-5 text-primary" />}
                value={String(metrics.wordsRead)}
                accentClassName="bg-primary/10"
              />
            </View>

            <View className="flex-row flex-wrap gap-3">
              <ResultMetric
                title="Tốc độ"
                icon={<GaugeIcon className="size-5 text-primary" />}
                value={`${metrics.wpm} WPM`}
                accentClassName="bg-primary/10"
              />
              <ResultMetric
                title="Bản ghi"
                icon={<MicIcon className="size-5 text-primary" />}
                value={String(sessionRecordings.length)}
                accentClassName="bg-primary/10"
              />
            </View>
          </View>
        }
        ListEmptyComponent={
          <Card>
            <CardContent className="px-4 py-5">
              <View className="items-center gap-2">
                <HeadphoneOffIcon className="size-8 text-muted-foreground" />
                <Text className="text-lg font-bold">Chưa có bản ghi</Text>
              </View>
            </CardContent>
          </Card>
        }
        ListHeaderComponentStyle={{ marginBottom: 8 }}
        renderItem={({ item }) => (
          <RecordingTile
            recording={item}
            showTitle
            showRenameAction={false}
            showConfirmDelete={false}
            onPlay={handleOpenPlayback}
            onDelete={handleDeleteRecording}
          />
        )}
        ListFooterComponent={
          <View className="mt-2 gap-3">
            <View className="flex-row gap-3">
              <Button
                variant="outline"
                size="lg"
                className="flex-1"
                onPress={handlePracticeAgain}
              >
                <RotateCcwIcon className="size-5 text-foreground" />
                <Text className="text-base font-semibold text-foreground">
                  Luyện lại
                </Text>
              </Button>
              <Button
                variant="default"
                size="lg"
                className="flex-1"
                disabled={isTooManyRecordings}
                onPress={handleComplete}
              >
                <Icon
                  as={CheckCheck}
                  className="size-5 text-primary-foreground"
                />
                <Text className="text-base font-semibold text-primary-foreground">
                  {hasRecordings ? "Tiếp theo" : "Xong"}
                </Text>
              </Button>
            </View>
          </View>
        }
      />

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
