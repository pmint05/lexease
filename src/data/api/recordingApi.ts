import {
    CreateRecordingRequest,
    EvaluationResponse,
    PatchRecordingRequest,
    RecordingResponse,
} from "@/src/core/types/recording";
import { apiClient, getApiBaseUrl } from "@/src/data/api/apiClient";

const rewriteLocalhostUrl = (url?: string): string | undefined => {
  if (!url) return undefined;

  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname !== "localhost") return url;

    const apiBase = new URL(getApiBaseUrl());
    parsedUrl.protocol = apiBase.protocol;
    parsedUrl.host = apiBase.host;
    parsedUrl.port = apiBase.port;
    return parsedUrl.toString();
  } catch {
    return url;
  }
};

const normalizeRecording = (
  recording: RecordingResponse,
): RecordingResponse => {
  return {
    ...recording,
    audioUrl: rewriteLocalhostUrl(recording.audioUrl),
    evaluation: recording.evaluation
      ? { ...recording.evaluation }
      : recording.evaluation,
  };
};

export const recordingApi = {
  createSessionRecording: async (
    sessionId: string,
    request: CreateRecordingRequest,
  ): Promise<RecordingResponse> => {
    const response = await apiClient.post<RecordingResponse>(
      `/sessions/${sessionId}/recordings`,
      request,
    );
    return normalizeRecording(response.data);
  },

  getRecording: async (id: string): Promise<RecordingResponse> => {
    const response = await apiClient.get<RecordingResponse>(
      `/recordings/${id}`,
    );
    return normalizeRecording(response.data);
  },

  updateRecording: async (
    id: string,
    request: PatchRecordingRequest,
  ): Promise<RecordingResponse> => {
    const response = await apiClient.patch<RecordingResponse>(
      `/recordings/${id}`,
      request,
    );
    return normalizeRecording(response.data);
  },

  deleteRecording: async (id: string): Promise<void> => {
    await apiClient.delete(`/recordings/${id}`);
  },

  getRecordingEvaluation: async (id: string): Promise<EvaluationResponse> => {
    const response = await apiClient.get<EvaluationResponse>(
      `/recordings/${id}/evaluation`,
    );
    return response.data;
  },

  getEvaluation: async (id: string): Promise<EvaluationResponse> => {
    const response = await apiClient.get<EvaluationResponse>(
      `/evaluations/${id}`,
    );
    return response.data;
  },

  retryEvaluation: async (id: string): Promise<EvaluationResponse> => {
    const response = await apiClient.post<EvaluationResponse>(
      `/evaluations/${id}/retry`,
    );
    return response.data;
  },

  deleteEvaluation: async (id: string): Promise<void> => {
    await apiClient.delete(`/evaluations/${id}`);
  },
};
