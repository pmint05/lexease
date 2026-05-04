import { useRouter } from "expo-router";
import { ChevronRight, Target, TrendingUp, Zap } from "lucide-react-native";
import React, { useMemo } from "react";
import { Card, ScrollView, Text, XStack, YStack } from "tamagui";

import { RecordingTile } from "@/src/components/child/RecordingTile";
import { COLORS } from "@/src/core/constants/colors";
import { sampleBooks } from "@/src/data/local/books";
import { useAudioRecording } from "@/src/hooks/useAudioRecording";
import { useLearningStore } from "@/src/store/useLearningStore";
import { useRecordingStore } from "@/src/store/useRecordingStore";

/**
 * Guardian Dashboard Screen
 * Displays analytics and progress insights for the child:
 * - Reading time summary
 * - Comprehension scores
 * - Reading streak
 * - Progress charts
 * - Vocabulary growth
 */
export default function DashboardScreen(): React.ReactElement {
  const router = useRouter();
  const { sessions } = useLearningStore();
  const { recordings, removeRecording } = useRecordingStore();
  const { playbackRecording } = useAudioRecording();

  const summary = useMemo(() => {
    const totalDurationMs = sessions.reduce((sum, session) => sum + session.durationMs, 0);
    const booksRead = new Set(sessions.map((session) => session.bookId)).size;
    const wordsRead = sessions.reduce((sum, session) => sum + session.wordsRead, 0);
    const latestSession = sessions[0];

    return {
      totalDurationMs,
      booksRead,
      wordsRead,
      latestSession,
    };
  }, [sessions]);

  const recentBooks = useMemo(() => {
    return sessions.slice(0, 5).map((session) => {
      const book = sampleBooks.find((item) => item.id === session.bookId);
      return {
        ...session,
        bookTitle: book?.title ?? session.bookTitle,
      };
    });
  }, [sessions]);

  const booksWithHistory = useMemo(() => {
    const map = new Map<string, { bookId: string; title: string; count: number; totalMinutes: number }>();
    sessions.forEach((session) => {
      const prev = map.get(session.bookId);
      const nextCount = (prev?.count ?? 0) + 1;
      const nextMinutes = (prev?.totalMinutes ?? 0) + Math.round(session.durationMs / 60000);
      map.set(session.bookId, {
        bookId: session.bookId,
        title: session.bookTitle,
        count: nextCount,
        totalMinutes: nextMinutes,
      });
    });
    return Array.from(map.values());
  }, [sessions]);

  const statistics = useMemo(() => {
    if (sessions.length === 0) {
      return {
        avgSpeedPerSession: 0,
        readingStreak: 0,
        favoriteDifficulty: null,
        totalSessions: 0,
        avgWordsPerSession: 0,
        progressTrend: "neutral" as const,
      };
    }

    const avgSpeedPerSession =
      sessions.reduce((sum, s) => sum + s.speed, 0) / sessions.length;

    const avgWordsPerSession =
      sessions.reduce((sum, s) => sum + s.wordsRead, 0) / sessions.length;

    const lastSessionDate = new Date(sessions[0].startedAt);
    const today = new Date();
    const daysDiff = Math.floor(
      (today.getTime() - lastSessionDate.getTime()) / 86400000,
    );
    const readingStreak = daysDiff === 0 ? 1 : 0;

    const difficultyCount: Record<string, number> = {};
    sessions.forEach((session) => {
      const book = sampleBooks.find((b) => b.id === session.bookId);
      if (book) {
        difficultyCount[book.difficulty] =
          (difficultyCount[book.difficulty] ?? 0) + 1;
      }
    });

    const favoriteDifficulty = Object.entries(difficultyCount).sort(
      ([, a], [, b]) => b - a,
    )[0]?.[0] ?? null;

    const recentSessions = sessions.slice(0, 3);
    const olderSessions = sessions.slice(3, 6);
    const recentAvgSpeed =
      recentSessions.length > 0
        ? recentSessions.reduce((sum, s) => sum + s.speed, 0) /
          recentSessions.length
        : 0;
    const olderAvgSpeed =
      olderSessions.length > 0
        ? olderSessions.reduce((sum, s) => sum + s.speed, 0) /
          olderSessions.length
        : 0;

    const progressTrend =
      recentAvgSpeed < olderAvgSpeed
        ? ("improving" as const)
        : recentAvgSpeed > olderAvgSpeed
          ? ("declining" as const)
          : ("neutral" as const);

    return {
      avgSpeedPerSession,
      readingStreak,
      favoriteDifficulty,
      totalSessions: sessions.length,
      avgWordsPerSession,
      progressTrend,
    };
  }, [sessions]);

  const difficultyColor: Record<string, string> = {
    easy: COLORS.easy,
    medium: COLORS.medium,
    hard: COLORS.hard,
  };

  const insights = useMemo(() => {
    const tips: { emoji: string; title: string; text: string }[] = [];

    if (sessions.length === 0) {
      tips.push({
        emoji: "🚀",
        title: "Bắt đầu hành trình",
        text: "Khuyến khích con đọc sách đầu tiên để bắt đầu trải nghiệm!",
      });
    } else if (sessions.length < 5) {
      tips.push({
        emoji: "⭐",
        title: "Tốt lắm!",
        text: "Con đang xây dựng thói quen đọc tuyệt vời. Hãy tiếp tục!",
      });
    } else if (sessions.length >= 10) {
      tips.push({
        emoji: "🏆",
        title: "Đạt mốc 10 phiên!",
        text: "Con đã hoàn thành 10 phiên đọc. Đó là một thành tích lớn!",
      });
    }

    if (statistics.favoriteDifficulty === "easy" && sessions.length >= 5) {
      tips.push({
        emoji: "💪",
        title: "Sẵn sàng thử thách?",
        text: "Con thành thạo với sách dễ. Hãy thử sách trung bình để tiến bộ!",
      });
    }

    if (statistics.progressTrend === "improving") {
      tips.push({
        emoji: "📈",
        title: "Tiến độ tuyệt vời",
        text: `Tốc độ đọc của con đang cải thiện. Con đang từ ${statistics.avgSpeedPerSession.toFixed(2)}x!
`,
      });
    }

    if (statistics.totalSessions > 0 && summary.totalDurationMs > 3600000) {
      tips.push({
        emoji: "⏱️",
        title: "Học tập kiên trì",
        text: `Con đã dành ${Math.round(summary.totalDurationMs / 3600000)} giờ để đọc. Tuyệt vời!",`,
      });
    }

    if (statistics.totalSessions > 0 && statistics.avgWordsPerSession > 100) {
      tips.push({
        emoji: "📚",
        title: "Từ vựng phong phú",
        text: `Con đã học trung bình ${Math.round(statistics.avgWordsPerSession)} từ mỗi phiên!`,
      });
    }

    return tips.length > 0
      ? tips.slice(0, 2)
      : [
          {
            emoji: "💡",
            title: "Mẹo",
            text: "Mỗi lần đọc là một cơ hội để học. Hãy khuyến khích con đọc mỗi ngày!",
          },
        ];
  }, [sessions, statistics, summary]);

  return (
    <YStack flex={1} backgroundColor={COLORS.cream} padding="$4" gap="$4">
      <XStack justifyContent="space-between" alignItems="center">
        <Text
          fontSize="$7"
          fontWeight="bold"
          accessibilityRole="header"
          accessibilityLabel="Guardian dashboard"
        >
          📊 Guardian Dashboard
        </Text>
        <Text
          onPress={() => router.replace("/(auth)/role-selection")}
          padding="$2"
          color={COLORS.blue}
          fontWeight="700"
          accessible
          accessibilityRole="button"
          accessibilityLabel="Quay lại chọn vai trò"
        >
          Đổi vai trò
        </Text>
      </XStack>

      <ScrollView showsVerticalScrollIndicator={false}>
        <YStack gap="$3">
          <Card
            padding="$4"
            borderWidth={1}
            borderColor="$color5"
            backgroundColor={COLORS.blue}
          >
            <YStack gap="$2">
              <Text fontSize="$2" color="white" fontWeight="600">
                Tổng thời gian học
              </Text>
              <Text fontSize="$8" fontWeight="900" color="white">
                {Math.round(summary.totalDurationMs / 60000)} phút
              </Text>
              <Text color="rgba(255,255,255,0.8)" fontSize="$2">
                {summary.booksRead} sách · {summary.wordsRead} từ
              </Text>
            </YStack>
          </Card>

          <XStack gap="$3" flexWrap="wrap">
            <Card
              flex={1}
              minWidth={150}
              padding="$3"
              borderWidth={1}
              borderColor="$color5"
              backgroundColor="$background"
            >
              <YStack gap="$2" alignItems="center">
                <Zap color={COLORS.orange} size={20} />
                <Text fontSize="$2" color="$color10">
                  Tốc độ trung bình
                </Text>
                <Text fontSize="$6" fontWeight="700">
                  {statistics.avgSpeedPerSession.toFixed(2)}x
                </Text>
              </YStack>
            </Card>

            <Card
              flex={1}
              minWidth={150}
              padding="$3"
              borderWidth={1}
              borderColor="$color5"
              backgroundColor="$background"
            >
              <YStack gap="$2" alignItems="center">
                <Target color={COLORS.green} size={20} />
                <Text fontSize="$2" color="$color10">
                  Phiên học
                </Text>
                <Text fontSize="$6" fontWeight="700">
                  {statistics.totalSessions}
                </Text>
              </YStack>
            </Card>

            <Card
              flex={1}
              minWidth={150}
              padding="$3"
              borderWidth={1}
              borderColor="$color5"
              backgroundColor="$background"
            >
              <YStack gap="$2" alignItems="center">
                <TrendingUp
                  color={
                    statistics.progressTrend === "improving"
                      ? COLORS.green
                      : statistics.progressTrend === "declining"
                        ? COLORS.red
                        : COLORS.textMuted
                  }
                  size={20}
                />
                <Text fontSize="$2" color="$color10">
                  Xu hướng
                </Text>
                <Text
                  fontSize="$5"
                  fontWeight="700"
                  color={
                    statistics.progressTrend === "improving"
                      ? COLORS.green
                      : statistics.progressTrend === "declining"
                        ? COLORS.red
                        : COLORS.textMuted
                  }
                >
                  {statistics.progressTrend === "improving"
                    ? "Tốt"
                    : statistics.progressTrend === "declining"
                      ? "Chậm"
                      : "Ổn"}
                </Text>
              </YStack>
            </Card>
          </XStack>

          <Card padding="$4" borderWidth={1} borderColor="$color5">
            <YStack gap="$3">
              <XStack justifyContent="space-between" alignItems="center">
                <Text fontSize="$5" fontWeight="700">
                  � Lời khuyên cho phụ huynh
                </Text>
              </XStack>

              <YStack gap="$2">
                {insights.map((insight, idx) => (
                  <Card
                    key={idx}
                    padding="$3"
                    borderWidth={1}
                    borderColor="$color4"
                    backgroundColor="$color2"
                  >
                    <YStack gap="$2">
                      <XStack alignItems="center" gap="$2">
                        <Text fontSize="$6">{insight.emoji}</Text>
                        <Text fontSize="$4" fontWeight="700" color={COLORS.textDark}>
                          {insight.title}
                        </Text>
                      </XStack>
                      <Text fontSize="$3" color={COLORS.textMuted} lineHeight={20}>
                        {insight.text}
                      </Text>
                    </YStack>
                  </Card>
                ))}
              </YStack>
            </YStack>
          </Card>

          <Card padding="$4" borderWidth={1} borderColor="$color5">
            <YStack gap="$3">
              <Text fontSize="$5" fontWeight="700">
                📈 Thống kê chi tiết
              </Text>

              <YStack gap="$3">
                <YStack gap="$1">
                  <XStack justifyContent="space-between">
                    <Text fontSize="$3" color="$color10">
                      Trung bình từ/phiên
                    </Text>
                    <Text fontSize="$3" fontWeight="700">
                      {Math.round(statistics.avgWordsPerSession)}
                    </Text>
                  </XStack>
                  <YStack
                    height={8}
                    borderRadius="$2"
                    backgroundColor="$color4"
                    overflow="hidden"
                  >
                    <YStack
                      height={8}
                      backgroundColor={COLORS.green}
                      width={`${Math.min(
                        (statistics.avgWordsPerSession / 50) * 100,
                        100,
                      )}%`}
                    />
                  </YStack>
                </YStack>

                <YStack gap="$1">
                  <XStack justifyContent="space-between">
                    <Text fontSize="$3" color="$color10">
                      Độ khó yêu thích
                    </Text>
                    {statistics.favoriteDifficulty ? (
                      <YStack
                        paddingHorizontal="$2"
                        paddingVertical="$1"
                        borderRadius="$2"
                        backgroundColor={
                          difficultyColor[statistics.favoriteDifficulty] +
                          "22"
                        }
                      >
                        <Text
                          fontSize="$2"
                          fontWeight="700"
                          color={
                            difficultyColor[statistics.favoriteDifficulty]
                          }
                        >
                          {statistics.favoriteDifficulty.toUpperCase()}
                        </Text>
                      </YStack>
                    ) : (
                      <Text fontSize="$3" color="$color10">
                        N/A
                      </Text>
                    )}
                  </XStack>
                </YStack>
              </YStack>
            </YStack>
          </Card>

          <Card padding="$4" borderWidth={1} borderColor="$color5">
            <YStack gap="$3">
              <XStack justifyContent="space-between">
                <YStack>
                  <Text fontSize="$2" color="$gray" fontWeight="600">
                    Sách đã học
                  </Text>
                  <Text fontSize="$6" fontWeight="bold">
                    {summary.booksRead} cuốn
                  </Text>
                </YStack>
                <Text fontSize="$8">📚</Text>
              </XStack>

              <YStack height={200} justifyContent="flex-end">
                <XStack
                  justifyContent="space-around"
                  alignItems="flex-end"
                  height={150}
                  gap="$2"
                >
                  {booksWithHistory.length > 0 ? (
                    booksWithHistory.slice(0, 5).map((book) => {
                      const maxMinutes = Math.max(
                        ...booksWithHistory.map((b) => b.totalMinutes),
                      );
                      const barHeight = (book.totalMinutes / maxMinutes) * 120;
                      return (
                        <YStack
                          key={book.bookId}
                          flex={1}
                          alignItems="center"
                          gap="$1"
                        >
                          <YStack
                            width="100%"
                            height={barHeight}
                            borderRadius="$2"
                            backgroundColor={COLORS.blue}
                            opacity={0.7}
                          />
                          <Text
                            fontSize="$1"
                            color="$color10"
                            numberOfLines={2}
                            textAlign="center"
                          >
                            {book.title.split(" ")[0]}
                          </Text>
                          <Text fontSize="$1" color="$color10">
                            {book.totalMinutes}p
                          </Text>
                        </YStack>
                      );
                    })
                  ) : (
                    <Text color="$color10">Chưa có dữ liệu</Text>
                  )}
                </XStack>
              </YStack>

              {booksWithHistory.length > 0 ? (
                booksWithHistory.map((book) => (
                  <XStack
                    key={book.bookId}
                    justifyContent="space-between"
                    alignItems="center"
                    paddingVertical="$2"
                    borderBottomWidth={1}
                    borderBottomColor="$color4"
                    onPress={() => router.push({ pathname: "/(guardian)/book/[id]", params: { id: book.bookId } })}
                    accessible
                    accessibilityRole="button"
                    accessibilityLabel={`Xem chi tiết sách ${book.title}`}
                  >
                    <YStack>
                      <Text fontWeight="700">{book.title}</Text>
                      <Text color="$color10">
                        {book.count} lần · {book.totalMinutes}p · Bấm xem chi tiết
                      </Text>
                    </YStack>
                    <ChevronRight color={COLORS.textMuted} size={16} />
                  </XStack>
                ))
              ) : (
                <Text color="$color10">Chưa có sách đã học.</Text>
              )}
            </YStack>
          </Card>

          {summary.latestSession && (
          <Card
            padding="$4"
            borderWidth={2}
            borderColor={COLORS.easy}
            backgroundColor={COLORS.easy + "22"}
            onPress={() =>
              router.push({
                pathname: "/(guardian)/book/[id]",
                params: { id: summary.latestSession.bookId },
              })
            }
            pressStyle={{ scale: 0.98 }}
            accessible
            accessibilityRole="button"
            accessibilityLabel="Xem chi tiết lần học gần nhất"
          >
            <YStack gap="$2">
              <XStack justifyContent="space-between">
                <YStack>
                  <Text fontSize="$2" color="$color10" fontWeight="600">
                    Lần học gần nhất
                  </Text>
                  <Text fontSize="$6" fontWeight="bold" color={COLORS.textDark}>
                    {summary.latestSession ? `${summary.latestSession.bookTitle}` : "Chưa có dữ liệu"}
                  </Text>
                  {summary.latestSession ? (
                    <Text color="$color10" fontSize="$2">
                      {Math.round(summary.latestSession.durationMs / 60000)} phút · {summary.latestSession.wordsRead} từ · {summary.latestSession.speed}x
                    </Text>
                  ) : null}
                </YStack>
                <Text fontSize="$7">🎯</Text>
              </XStack>
            </YStack>
          </Card>
          )}

          <Card padding="$4" borderWidth={1} borderColor="$color5">
            <YStack gap="$3">
              <XStack justifyContent="space-between">
                <YStack>
                  <Text fontSize="$2" color="$gray" fontWeight="600">
                    Bản ghi âm
                  </Text>
                  <Text fontSize="$6" fontWeight="bold">
                    {recordings.length} file
                  </Text>
                </YStack>
                <Text fontSize="$8">🎙️</Text>
              </XStack>
            </YStack>
          </Card>

          <Card
            padding="$4"
            borderWidth={1}
            borderColor="$color5"
            accessible
            accessibilityRole="summary"
            accessibilityLabel="Recent child reading sessions"
          >
            <YStack gap="$3">
              <Text fontSize="$5" fontWeight="700">
                📝 Nhật kí học gần đây
              </Text>
              {recentBooks.length > 0 ? (
                recentBooks.map((session) => (
                  <YStack key={session.id} paddingVertical="$2" borderBottomWidth={1} borderBottomColor="$color4">
                    <XStack justifyContent="space-between">
                      <YStack flex={1}>
                        <Text fontWeight="700">{session.bookTitle}</Text>
                        <Text color="$color10" fontSize="$2">
                          {new Date(session.startedAt).toLocaleString("vi-VN", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </Text>
                      </YStack>
                      <YStack alignItems="flex-end" gap="$1">
                        <Text fontWeight="700" color={COLORS.green}>
                          {Math.round(session.durationMs / 60000)}p
                        </Text>
                        <Text color="$color10" fontSize="$2">
                          {session.wordsRead} từ
                        </Text>
                      </YStack>
                    </XStack>
                  </YStack>
                ))
              ) : (
                <Text color="$color10">Chưa có phiên học nào.</Text>
              )}
            </YStack>
          </Card>

          {recordings.length > 0 && (
          <Card padding="$4" borderWidth={1} borderColor="$color5">
            <YStack gap="$3">
              <Text fontSize="$5" fontWeight="700">🎙️ File ghi âm gần đây</Text>
              {recordings.length > 0 ? (
                recordings.slice(0, 5).map((recording) => (
                  <RecordingTile
                    key={recording.id}
                    recording={recording}
                    onPlay={async (item) => {
                      await playbackRecording(item.filePath);
                    }}
                    onDelete={removeRecording}
                  />
                ))
              ) : (
                <Text color="$color10">Chưa có file ghi âm nào.</Text>
              )}
            </YStack>
          </Card>
          )}
        </YStack>
      </ScrollView>
    </YStack>
  );
}
