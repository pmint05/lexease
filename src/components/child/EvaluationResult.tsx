import { Badge } from "@/src/components/ui/badge";
import { Card, CardContent, CardTitle } from "@/src/components/ui/card";
import { Text } from "@/src/components/ui/text";
import { FONT_MAP } from "@/src/core/constants/fonts";
import { EvaluationResponse } from "@/src/core/types/recording";
import { useReadingStore } from "@/src/store/useReadingStore";
import { normalizeWord } from "@/src/utils/textProcessing";
import { AlertCircle, Star } from "lucide-react-native";
import { ScrollView, View } from "react-native";

interface EvaluationResultProps {
  evaluation: EvaluationResponse;
  expectedText: string;
}

export const EvaluationResult = ({
  evaluation,
  expectedText,
}: EvaluationResultProps) => {
  const { fontSize, fontFamily, letterSpacing, lineHeight } = useReadingStore();
  const fontFamilyStyle = FONT_MAP[fontFamily] || FONT_MAP.System;

  const accuracy = (evaluation.scores?.accuracy as number) || 0;
  const accuracyPercent = Math.round(accuracy * 100);

  const getStarCount = (score: number) => {
    if (score >= 0.5) return 3;
    if (score >= 0.3) return 2;
    if (score >= 0.2) return 1;
    return 0;
  };

  const stars = getStarCount(accuracy);

  return (
    <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
      {/* Header Summary */}
      <View className="items-center py-6">
        <View className="flex-row gap-2 mb-4">
          {[1, 2, 3].map((s) => (
            <Star
              key={s}
              size={48}
              fill={s <= stars ? "#FACC15" : "transparent"}
              color={s <= stars ? "#FACC15" : "#E2E8F0"}
            />
          ))}
        </View>
        <Text className="text-4xl font-black text-primary">
          {accuracyPercent}%
        </Text>
        <Text className="text-lg font-medium text-muted-foreground mt-1 text-center px-4">
          {stars === 3
            ? "Tuyệt vời! Bé đọc rất tốt."
            : stars === 2
              ? "Rất tốt! Bé chỉ cần chú ý thêm một chút."
              : "Cố lên nhé! Bé hãy luyện tập thêm nha."}
        </Text>
      </View>

      {/* AI Summary feedback */}
      {evaluation.summary && (
        <Card className="mb-6 border-primary/20 bg-primary/5 py-0">
          <CardContent className="p-4">
            <CardTitle asChild className="mb-3">
              <Text className="font-bold text-primary mb-1">
                Nhận xét từ hệ thống:
              </Text>
            </CardTitle>
            <Text className="text-foreground leading-relaxed text-base">
              {evaluation.summary}
            </Text>
          </CardContent>
        </Card>
      )}

      {/* Difficult Words */}
      {evaluation.difficultWords && evaluation.difficultWords.length > 0 && (
        <Card className="mb-6 !border-amber-500/20 !bg-amber-500/5 py-0">
          <CardContent className="p-4">
            <CardTitle asChild className="flex-row items-center gap-2 mb-3">
              <AlertCircle size={20} color="#EAB308" />
              <Text className="font-bold text-amber-600">
                Từ bé cần luyện thêm
              </Text>
            </CardTitle>
            <View className="flex-row flex-wrap gap-2">
              {evaluation.difficultWords.map((word, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="bg-white border-amber-500/30"
                >
                  <Text className="text-amber-500 font-medium">{word}</Text>
                </Badge>
              ))}
            </View>
          </CardContent>
        </Card>
      )}

      {/* Full Text Analysis */}
      <Card className="mb-10 py-0">
        <CardContent className="p-4">
          <CardTitle asChild className="mb-4">
            <Text className="font-bold">Chi tiết bài đọc</Text>
          </CardTitle>

          <View className="flex-row flex-wrap">
            {evaluation.words && evaluation.words.length > 0
              ? evaluation.words.map((wordData, idx) => {
                  const isCorrect = wordData.correct;
                  const isMissing = wordData.errorType === "missing";
                  const isSubstitution = wordData.errorType === "substitution";

                  return (
                    <View key={idx} className="items-center mr-3 mb-4">
                      <Text
                        style={{
                          fontFamily: fontFamilyStyle,
                          fontSize: fontSize * 0.8,
                          letterSpacing,
                          color: isCorrect
                            ? "#10B981" // Green
                            : isMissing
                              ? "#94A3B8" // Gray (Muted)
                              : "#F59E0B", // Orange (Substitution)
                          textDecorationLine: isMissing
                            ? "line-through"
                            : "none",
                        }}
                      >
                        {wordData.expected}
                      </Text>
                      {isSubstitution && wordData.heard && (
                        <Text className="text-[10px] text-destructive font-bold mt-[-4px]">
                          ({wordData.heard})
                        </Text>
                      )}
                    </View>
                  );
                })
              : expectedText.split(/\s+/).map((word, idx) => {
                  const cleanWord = normalizeWord(word);
                  const isDifficult = evaluation.difficultWords?.some(
                    (dw) => normalizeWord(dw) === cleanWord,
                  );

                  return (
                    <Text
                      key={idx}
                      style={{
                        fontFamily: fontFamilyStyle,
                        fontSize: fontSize * 0.8,
                        letterSpacing,
                        lineHeight: fontSize * 0.8 * lineHeight,
                        color: isDifficult ? "#EF4444" : "#1F2937",
                        backgroundColor: isDifficult
                          ? "#FEE2E2"
                          : "transparent",
                        paddingHorizontal: 2,
                        marginRight: 6,
                        marginBottom: 4,
                        textDecorationLine: isDifficult ? "underline" : "none",
                      }}
                    >
                      {word}
                    </Text>
                  );
                })}
          </View>
        </CardContent>
      </Card>
    </ScrollView>
  );
};
