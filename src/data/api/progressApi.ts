import {
  DifficultWordProgressResponse,
  ProgressBucketResponse,
  ProgressSessionDetailResponse,
  ProgressSessionResponse,
  ProgressSummaryResponse,
} from "@/src/core/types";
import { apiClient } from "@/src/data/api/apiClient";

export const progressApi = {
  getSummary: async (
    childId: string,
    range: string = "week",
  ): Promise<ProgressSummaryResponse> => {
    const response = await apiClient.get<ProgressSummaryResponse>(
      `/children/${childId}/progress/summary?range=${range}`,
    );
    return response.data;
  },

  getTimeseries: async (
    childId: string,
    range: string = "week",
  ): Promise<ProgressBucketResponse[]> => {
    const response = await apiClient.get<ProgressBucketResponse[]>(
      `/children/${childId}/progress/timeseries?range=${range}`,
    );
    return response.data;
  },

  getSessions: async (
    childId: string,
    range: string = "month",
  ): Promise<ProgressSessionResponse[]> => {
    const response = await apiClient.get<ProgressSessionResponse[]>(
      `/children/${childId}/progress/sessions?range=${range}`,
    );
    return response.data;
  },

  getSessionDetail: async (
    childId: string,
    sessionId: string,
  ): Promise<ProgressSessionDetailResponse> => {
    const response = await apiClient.get<ProgressSessionDetailResponse>(
      `/children/${childId}/progress/sessions/${sessionId}`,
    );
    return response.data;
  },

  getDifficultWords: async (
    childId: string,
    range: string = "month",
  ): Promise<DifficultWordProgressResponse[]> => {
    const response = await apiClient.get<DifficultWordProgressResponse[]>(
      `/children/${childId}/progress/difficult-words?range=${range}`,
    );
    return response.data;
  },
};
