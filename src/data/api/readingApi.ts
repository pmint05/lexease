import {
  BackendReadingSession,
  StartReadingSessionRequest,
  UpdateReadingProgressRequest,
} from "@/src/core/types/reading";
import { apiClient } from "@/src/data/api/apiClient";

export const readingApi = {
  startSession: async (
    request: StartReadingSessionRequest,
  ): Promise<BackendReadingSession> => {
    const response = await apiClient.post<BackendReadingSession>(
      "/sessions",
      request,
    );
    return response.data;
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
    return response.data;
  },

  getSession: async (id: string): Promise<BackendReadingSession> => {
    const response = await apiClient.get<BackendReadingSession>(
      `/sessions/${id}`,
    );
    return response.data;
  },

  updateProgress: async (
    id: string,
    request: UpdateReadingProgressRequest,
  ): Promise<BackendReadingSession> => {
    const response = await apiClient.patch<BackendReadingSession>(
      `/sessions/${id}/progress`,
      request,
    );
    return response.data;
  },

  completeSession: async (id: string): Promise<BackendReadingSession> => {
    const response = await apiClient.post<BackendReadingSession>(
      `/sessions/${id}/complete`,
    );
    return response.data;
  },
};

