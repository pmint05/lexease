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
import { Alert, FlatList, View } from "react-native";

import { AudioPlaybackModal } from "@/src/components/child/AudioPlaybackModal";
import { RecordingTile } from "@/src/components/child/RecordingTile";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Text } from "@/src/components/ui/text";
import { Recording } from "@/src/core/types";
import { useReadingSessionQuery } from "@/src/hooks/useReadingSessionQueries";
import { useLearningStore } from "@/src/store/useLearningStore";
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
          <Text className="text-3xl font-extrabold leading-none">{value}</Text>
        </View>
      </View>
    </Card>
  );
}

export default function ReadingResultScreen(): React.ReactElement {
  const router = useRouter();
  const { sessionId, storyId } = useLocalSearchParams<ResultParams>();
  const sessionQuery = useReadingSessionQuery(sessionId);
  const { sessions } = useLearningStore();
  const { recordings, removeRecording, clearRecordingsBySession } =
    useRecordingStore();

  const [playbackUri, setPlaybackUri] = useState<string | null>(null);
  const [playbackTitle, setPlaybackTitle] = useState("");
  const [playbackMeteringData, setPlaybackMeteringData] = useState<
    number[] | undefined
  >([]);
  const [isPlaybackOpen, setIsPlaybackOpen] = useState(false);

  const sessionSummary = useMemo(() => {
    if (!sessionId) return null;
    return (
      sessions.find(
        (item) => item.sessionId === sessionId || item.id === sessionId,
      ) ?? null
    );
  }, [sessionId, sessions]);

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

  const handleDeleteRecording = (recordingId: string) => {
    Alert.alert("Xóa bản ghi?", "Bản ghi này sẽ bị xóa khỏi phiên hiện tại.", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: () => {
          removeRecording(recordingId);
        },
      },
    ]);
  };

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
    router.replace("/(child)/(tabs)/library");
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
  const completedSession = sessionSummary ?? null;

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
                    <CheckCheck className="size-8 text-primary" />
                  </View>
                  <Text className="text-3xl font-extrabold text-center">
                    Xong rồi
                  </Text>
                  <Text className="text-center text-muted-foreground">
                    {completedSession?.bookTitle ??
                      backendSession?.story.title ??
                      "Bài đọc"}
                  </Text>
                </View>
              </CardContent>
            </Card>

            <View className="flex-row items-center gap-2">
              <Repeat2 className="size-4 text-muted-foreground" />
              <Text className="text-sm text-muted-foreground">
                Chạm để nghe, thu lại hoặc xóa.
              </Text>
            </View>

            <View className="flex-row flex-wrap gap-3">
              <ResultMetric
                title="Thời gian"
                icon={<Clock3 className="size-5 text-primary" />}
                value={formatReadingTime(
                  completedSession?.durationMs ??
                    backendSession?.elapsedMs ??
                    0,
                )}
                accentClassName="bg-primary/10"
              />
              <ResultMetric
                title="Số từ"
                icon={<CaseSensitiveIcon className="size-5 text-primary" />}
                value={String(
                  completedSession?.wordsRead ??
                    backendSession?.resumePosition.wordIndex ??
                    0,
                )}
                accentClassName="bg-primary/10"
              />
            </View>

            <View className="flex-row flex-wrap gap-3">
              <ResultMetric
                title="Tốc độ"
                icon={<GaugeIcon className="size-5 text-primary" />}
                value={`${(completedSession?.speed ?? 1).toFixed(2)}x`}
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
                onPress={handleComplete}
              >
                <CheckCheck className="size-5 text-foreground" />
                <Text className="text-base font-semibold text-foreground">
                  Xong
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
