import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/src/components/ui/text";
import { Button } from "@/src/components/ui/button";
import { EvaluationResult } from "@/src/components/child/EvaluationResult";
import { useCreateRecording, useRecordingEvaluation } from "@/src/hooks/useRecordingQueries";
import { useStoryQuery } from "@/src/hooks/useStoryQueries";
import { useRecordingStore } from "@/src/store/useRecordingStore";
import { X, RefreshCcw } from "lucide-react-native";

export default function EvaluationScreen() {
  const router = useRouter();
  const { sessionId, storyId } = useLocalSearchParams<{ sessionId: string; storyId: string }>();
  const { recordings, clearRecordingsBySession } = useRecordingStore();
  const storyQuery = useStoryQuery(storyId);

  const [currentRecordingId, setCurrentRecordingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const createRecordingMutation = useCreateRecording();
  const evaluationQuery = useRecordingEvaluation(currentRecordingId || undefined);

  const sessionRecordings = recordings.filter((r) => r.sessionId === sessionId);

  useEffect(() => {
    const startEvaluation = async () => {
      if (sessionRecordings.length === 0) {
        setError("Không tìm thấy bản ghi nào để chấm điểm.");
        return;
      }

      if (!storyQuery.data?.content) {
        return; // Wait for story data
      }

      try {
        // We pick the first recording for evaluation as per simple logic
        // (In a more complex scenario, we might want to evaluate all or let child pick)
        const targetRecording = sessionRecordings[0];
        
        const result = await createRecordingMutation.mutateAsync({
          sessionId,
          filePath: targetRecording.filePath,
          expectedText: storyQuery.data.content,
          durationMs: targetRecording.durationMs,
        });

        setCurrentRecordingId(result.id);
      } catch (err: any) {
        setError(err.message || "Có lỗi xảy ra khi tải bản ghi lên.");
      }
    };

    if (!currentRecordingId && !error && storyQuery.isSuccess) {
      startEvaluation();
    }
  }, [sessionId, storyQuery.isSuccess, storyQuery.data, currentRecordingId, error]);

  const handleFinish = () => {
    clearRecordingsBySession(sessionId);
    router.replace("/(child)/(tabs)/library");
  };

  const handleRetry = () => {
    createRecordingMutation.reset();
    setError(null);
    setCurrentRecordingId(null);
  };

  const isLoading = createRecordingMutation.isPending || 
                    evaluationQuery.isLoading || 
                    evaluationQuery.data?.status === "PENDING" || 
                    evaluationQuery.data?.status === "PROCESSING";

  const isCompleted = evaluationQuery.data?.status === "DONE" || 
                      evaluationQuery.data?.status === "FAILED" || 
                      !!error;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center justify-between px-4 py-2 border-b border-border">
        <Text className="text-xl font-bold text-primary">Kết quả chấm điểm</Text>
        <Button 
          variant="ghost" 
          size="icon" 
          onPress={handleFinish}
          disabled={!isCompleted}
        >
          <X size={24} color={isCompleted ? "#64748B" : "#CBD5E1"} />
        </Button>
      </View>

      <View className="flex-1">
        {error ? (
          <View className="flex-1 items-center justify-center p-6">
            <Text className="text-destructive text-center mb-4">{error}</Text>
            <Button onPress={handleRetry} className="flex-row gap-2">
              <RefreshCcw size={20} color="white" />
              <Text>Thử lại</Text>
            </Button>
          </View>
        ) : isLoading ? (
          <View className="flex-1 items-center justify-center p-6">
            <ActivityIndicator size="large" color="#6366F1" />
            <Text className="mt-4 text-lg font-medium text-center">
              Đang phân tích giọng đọc của bé...
            </Text>
            <Text className="text-muted-foreground text-center mt-2">
              Chờ một chút xíu thôi nhé!
            </Text>
          </View>
        ) : evaluationQuery.data?.status === "DONE" ? (
          <EvaluationResult 
            evaluation={evaluationQuery.data} 
            expectedText={storyQuery.data?.content || ""}
          />
        ) : evaluationQuery.data?.status === "FAILED" ? (
          <View className="flex-1 items-center justify-center p-6">
            <Text className="text-destructive text-center mb-4">
              Rất tiếc, hệ thống không thể phân tích bản ghi này.
            </Text>
            <Button onPress={handleRetry}>
              <Text>Thử lại</Text>
            </Button>
          </View>
        ) : null}
      </View>

      <View className="p-4 border-t border-border">
        <Button 
          size="lg" 
          className="w-full" 
          onPress={handleFinish}
          disabled={!isCompleted}
        >
          <Text className="text-lg font-bold">Xong rồi</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
