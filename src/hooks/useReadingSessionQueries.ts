import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  StartReadingSessionRequest,
  UpdateReadingProgressRequest,
} from "@/src/core/types/reading";
import { readingApi } from "@/src/data/api/readingApi";
import { useAuthStore } from "@/src/store/useAuthStore";

export const readingSessionQueryKeys = {
  all: ["readingSessions"] as const,
  active: (storyId: string, voice?: string) =>
    [...readingSessionQueryKeys.all, "active", storyId, voice] as const,
  detail: (id: string) => [...readingSessionQueryKeys.all, "detail", id] as const,
};

export const useActiveReadingSessionQuery = (
  storyId?: string,
  voice?: string,
) => {
  const token = useAuthStore((s) => s.token);

  return useQuery({
    queryKey: readingSessionQueryKeys.active(storyId ?? "", voice),
    queryFn: () => readingApi.getActiveSession({ storyId: storyId ?? "", voice }),
    enabled: Boolean(token && storyId),
    retry: false,
  });
};

export const useReadingSessionQuery = (id?: string) => {
  const token = useAuthStore((s) => s.token);

  return useQuery({
    queryKey: readingSessionQueryKeys.detail(id ?? ""),
    queryFn: () => readingApi.getSession(id ?? ""),
    enabled: Boolean(token && id),
  });
};

export const useStartReadingSessionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: StartReadingSessionRequest) =>
      readingApi.startSession(request),
    onSuccess: (session) => {
      queryClient.setQueryData(
        readingSessionQueryKeys.detail(session.sessionId),
        session,
      );
      queryClient.setQueryData(
        readingSessionQueryKeys.active(session.story.id, session.tts.voice),
        session,
      );
    },
  });
};

export const useUpdateReadingProgressMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      sessionId,
      request,
    }: {
      sessionId: string;
      request: UpdateReadingProgressRequest;
    }) => readingApi.updateProgress(sessionId, request),
    onSuccess: (session) => {
      queryClient.setQueryData(
        readingSessionQueryKeys.detail(session.sessionId),
        session,
      );
      queryClient.setQueryData(
        readingSessionQueryKeys.active(session.story.id, session.tts.voice),
        session,
      );
    },
  });
};

export const useCompleteReadingSessionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => readingApi.completeSession(sessionId),
    onSuccess: (session) => {
      queryClient.setQueryData(
        readingSessionQueryKeys.detail(session.sessionId),
        session,
      );
      queryClient.invalidateQueries({ queryKey: readingSessionQueryKeys.all });
    },
  });
};

