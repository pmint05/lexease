import * as FileSystem from "expo-file-system/legacy";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Platform } from "react-native";
import { recordingApi } from "@/src/data/api/recordingApi";
import { CreateRecordingRequest, EvaluationResponse } from "@/src/core/types/recording";

export const useCreateRecording = () => {
  return useMutation({
    mutationFn: async ({
      sessionId,
      filePath,
      expectedText,
      durationMs,
    }: {
      sessionId: string;
      filePath: string;
      expectedText: string;
      durationMs?: number;
    }) => {
      let base64Content = "";

      if (Platform.OS === "web") {
        // On web, filePath is usually a blob: URL
        const response = await fetch(filePath);
        const blob = await response.blob();
        
        base64Content = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = reader.result as string;
            // result is "data:audio/webm;base64,XXXX..."
            const base64 = result.split(",")[1];
            resolve(base64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } else {
        // On native, use expo-file-system
        base64Content = await FileSystem.readAsStringAsync(filePath, {
          encoding: "base64",
        });
      }

      // Determine mime type
      const extension = filePath.split(".").pop()?.toLowerCase();
      // On web, expo-audio usually records as webm or m4a depending on browser
      let mimeType = "audio/mpeg";
      if (Platform.OS === "web") {
        mimeType = "audio/webm"; // Default for most web recorders
      } else if (extension === "m4a") {
        mimeType = "audio/m4a";
      }

      const request: CreateRecordingRequest = {
        expectedText,
        durationMs,
        voice: {
          mimeType,
          contentBase64: base64Content,
        },
      };

      return recordingApi.createSessionRecording(sessionId, request);
    },
  });
};

export const useRecordingEvaluation = (recordingId: string | undefined) => {
  return useQuery({
    queryKey: ["recording-evaluation", recordingId],
    queryFn: () => {
      if (!recordingId) throw new Error("Recording ID is required");
      return recordingApi.getRecordingEvaluation(recordingId);
    },
    enabled: !!recordingId,
    refetchInterval: (query) => {
      const data = query.state.data as EvaluationResponse | undefined;
      // Continue polling if pending or processing
      if (data?.status === "PENDING" || data?.status === "PROCESSING") {
        return 3000; // Poll every 3 seconds
      }
      return false;
    },
  });
};

export const useEvaluationDetail = (evaluationId: string | undefined) => {
  return useQuery({
    queryKey: ["evaluation", evaluationId],
    queryFn: () => {
      if (!evaluationId) throw new Error("Evaluation ID is required");
      return recordingApi.getEvaluation(evaluationId);
    },
    enabled: !!evaluationId,
  });
};
