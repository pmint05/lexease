import { useQuery } from "@tanstack/react-query";
import { progressApi } from "@/src/data/api/progressApi";
import { useAnalyticsStore } from "@/src/store/useAnalyticsStore";

export const progressQueryKeys = {
  all: ["progress"] as const,
  summary: (childId: string, range: string) => [...progressQueryKeys.all, "summary", childId, range] as const,
  timeseries: (childId: string, range: string) => [...progressQueryKeys.all, "timeseries", childId, range] as const,
  sessions: (childId: string, range: string) => [...progressQueryKeys.all, "sessions", childId, range] as const,
  sessionDetail: (childId: string, sessionId: string) => [...progressQueryKeys.all, "sessionDetail", childId, sessionId] as const,
  difficultWords: (childId: string, range: string) => [...progressQueryKeys.all, "difficultWords", childId, range] as const,
};

export const useProgressSummaryQuery = (childId: string) => {
  const range = useAnalyticsStore((s) => s.range);
  return useQuery({
    queryKey: progressQueryKeys.summary(childId, range),
    queryFn: () => progressApi.getSummary(childId, range),
    enabled: Boolean(childId),
  });
};

export const useProgressTimeseriesQuery = (childId: string) => {
  const range = useAnalyticsStore((s) => s.range);
  return useQuery({
    queryKey: progressQueryKeys.timeseries(childId, range),
    queryFn: () => progressApi.getTimeseries(childId, range),
    enabled: Boolean(childId),
  });
};

export const useProgressSessionsQuery = (childId: string) => {
  const range = useAnalyticsStore((s) => s.range);
  return useQuery({
    queryKey: progressQueryKeys.sessions(childId, range),
    queryFn: () => progressApi.getSessions(childId, range),
    enabled: Boolean(childId),
  });
};

export const useProgressSessionDetailQuery = (childId: string, sessionId: string) => {
  return useQuery({
    queryKey: progressQueryKeys.sessionDetail(childId, sessionId),
    queryFn: () => progressApi.getSessionDetail(childId, sessionId),
    enabled: Boolean(childId && sessionId),
  });
};

export const useDifficultWordsQuery = (childId: string) => {
  const range = useAnalyticsStore((s) => s.range);
  return useQuery({
    queryKey: progressQueryKeys.difficultWords(childId, range),
    queryFn: () => progressApi.getDifficultWords(childId, range),
    enabled: Boolean(childId),
  });
};
