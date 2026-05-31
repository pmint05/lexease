import {
  BackendReadingSession,
  StartReadingSessionRequest,
  UpdateReadingProgressRequest,
} from "@/src/core/types/reading";
import { apiClient, getApiBaseUrl } from "@/src/data/api/apiClient";

const rewriteLocalhostAudioUrl = (url: string | null): string | null => {
  if (!url) return null;

  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname !== "localhost") {
      return url;
    }

    const apiBaseUrl = getApiBaseUrl();
    const apiBase = new URL(apiBaseUrl);
    parsedUrl.protocol = apiBase.protocol;
    parsedUrl.host = apiBase.host;
    parsedUrl.port = apiBase.port;

    return parsedUrl.toString();
  } catch {
    return url;
  }
};

const normalizeSessionAudioUrl = (
  session: BackendReadingSession,
): BackendReadingSession => {
  return {
    ...session,
    tts: {
      ...session.tts,
      audioUrl: rewriteLocalhostAudioUrl(session.tts.audioUrl),
    },
  };
};

export const readingApi = {
  startSession: async (
    request: StartReadingSessionRequest,
  ): Promise<BackendReadingSession> => {
    const response = await apiClient.post<BackendReadingSession>(
      "/sessions",
      request,
    );
    return normalizeSessionAudioUrl(response.data);
  },

  getActiveSession: async (params: {
    storyId: string;
    voice?: string;
  }): Promise<BackendReadingSession> => {
    const searchParams = new URLSearchParams({ storyId: params.storyId });
    if (params.voice) searchParams.set("voice", params.voice);
    const response = await apiClient.get<BackendReadingSession>(
      `/sessions/active?${searchParams.toString()}`,
    );
    return normalizeSessionAudioUrl(response.data);
  },

  getSession: async (id: string): Promise<BackendReadingSession> => {
    const response = await apiClient.get<BackendReadingSession>(
      `/sessions/${id}`,
    );
    return normalizeSessionAudioUrl(response.data);
  },

  updateProgress: async (
    id: string,
    request: UpdateReadingProgressRequest,
  ): Promise<BackendReadingSession> => {
    const response = await apiClient.patch<BackendReadingSession>(
      `/sessions/${id}/progress`,
      request,
    );
    return normalizeSessionAudioUrl(response.data);
  },

  completeSession: async (id: string): Promise<BackendReadingSession> => {
    const response = await apiClient.post<BackendReadingSession>(
      `/sessions/${id}/complete`,
    );
    return normalizeSessionAudioUrl(response.data);
  },
};
