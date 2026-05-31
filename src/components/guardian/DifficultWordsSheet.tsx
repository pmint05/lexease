import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Text } from "@/src/components/ui/text";
import { X } from "lucide-react-native";
import React, { useEffect } from "react";
import { Modal, Pressable, ScrollView, View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface DifficultWord {
  word: string;
  count: number;
}

interface DifficultWordsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: DifficultWord[];
}

export function DifficultWordsSheet({
  open,
  onOpenChange,
  data,
}: DifficultWordsSheetProps): React.ReactElement | null {
  const [isVisible, setIsVisible] = React.useState(false);
  const slideAnim = useSharedValue(0);

  useEffect(() => {
    if (open) {
      setIsVisible(true);
      slideAnim.value = withTiming(1, {
        duration: 300,
        easing: Easing.out(Easing.cubic),
      });
    } else {
      slideAnim.value = withTiming(
        0,
        {
          duration: 250,
          easing: Easing.in(Easing.cubic),
        },
        () => {
          runOnJS(setIsVisible)(false);
        },
      );
    }
  }, [open, slideAnim]);

  const closeSheet = () => {
    onOpenChange(false);
  };

  const backdropStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(slideAnim.value, [0, 1], [0, 1]),
    };
  });

  const sheetStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(slideAnim.value, [0, 1], [600, 0]),
        },
      ],
    };
  });

  if (!isVisible && !open) return null;

  // Sort data from most errors to least
  const sortedData = [...data].sort((a, b) => b.count - a.count);

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      onRequestClose={closeSheet}
    >
      <View className="flex-1 justify-end bg-background">
        <Animated.View
          style={backdropStyle}
          className="absolute inset-0 bg-black/40"
        >
          <Pressable className="flex-1" onPress={closeSheet} />
        </Animated.View>

        <Animated.View
          style={sheetStyle}
          className="bg-background rounded-t-3xl shadow-xl overflow-hidden max-h-[80%]"
        >
          <View className="items-center py-3">
            <View className="h-1.5 w-12 rounded-full bg-muted" />
          </View>

          <View className="px-5 pb-2 flex-row justify-between items-center border-b border-border/50">
            <Text className="text-xl font-bold">Chi tiết từ khó</Text>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onPress={closeSheet}
            >
              <X size={20} className="text-muted-foreground" />
            </Button>
          </View>

          <ScrollView
            className="p-5"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            {sortedData.length > 0 ? (
              <View className="gap-3">
                <View className="flex-row justify-between items-center px-2 mb-2">
                  <Text className="text-sm font-semibold text-muted-foreground">
                    TỪ VỰNG
                  </Text>
                  <Text className="text-sm font-semibold text-muted-foreground">
                    SỐ LẦN SAI
                  </Text>
                </View>
                {sortedData.map((item, index) => (
                  <View
                    key={`${item.word}-${index}`}
                    className="flex-row justify-between items-center bg-card border border-border/50 p-3 rounded-xl"
                  >
                    <Text className="font-bold text-lg text-foreground">
                      {item.word}
                    </Text>
                    <Badge
                      variant={item.count > 3 ? "destructive" : "secondary"}
                    >
                      <Text className="font-bold px-1">{item.count} lần</Text>
                    </Badge>
                  </View>
                ))}
              </View>
            ) : (
              <View className="py-10 items-center">
                <Text className="text-muted-foreground italic">
                  Bé chưa gặp khó khăn với từ nào.
                </Text>
              </View>
            )}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}
