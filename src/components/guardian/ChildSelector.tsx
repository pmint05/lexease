import { Button } from "@/src/components/ui/button";
import { Icon } from "@/src/components/ui/icon";
import { Text } from "@/src/components/ui/text";
import { useEffectiveTheme } from "@/src/hooks/useEffectiveTheme";
import { useGuardianChildLinksQuery } from "@/src/hooks/useFamilyQueries";
import { cn } from "@/src/lib/utils";
import { getChildDisplayName, getChildEmail } from "@/src/utils/formatters";
import { useQueryClient } from "@tanstack/react-query";
import { Check, ChevronDown, User, X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useAuthStore } from "../../store/useAuthStore";
import { useFamilyStore } from "../../store/useFamilyStore";

type Props = {
  onChange?: (childId: string | null) => void;
  className?: string;
};

export default function ChildSelector({ onChange, className }: Props) {
  const [open, setOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const guardianId = user?.id ?? null;
  const { theme } = useEffectiveTheme();
  const queryClient = useQueryClient();

  const selectedChildId = useFamilyStore((s) =>
    guardianId ? s.selectedChildByGuardian[guardianId] : null,
  );
  const setSelectedChild = useFamilyStore((s) => s.setSelectedChild);
  const linksQuery = useGuardianChildLinksQuery();

  // Animation values
  const [rendered, setRendered] = useState(false);
  const progress = useSharedValue(0);

  const backdropStyle = useAnimatedStyle(() => {
    return {
      opacity: progress.value * 0.5,
    };
  });

  const sheetStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(progress.value, [0, 1], [450, 0]),
        },
      ],
      opacity: interpolate(progress.value, [0, 1], [0, 1]),
    };
  });

  useEffect(() => {
    if (open) {
      setRendered(true);
    }

    progress.value = withTiming(
      open ? 1 : 0,
      {
        duration: 240,
        easing: Easing.out(Easing.cubic),
      },
      (finished) => {
        if (!open && finished) {
          runOnJS(setRendered)(false);
        }
      },
    );
  }, [open, progress]);

  if (!guardianId) return null;

  const acceptedLinks = (linksQuery.data ?? []).filter(
    (link) => link.guardianId === guardianId && link.status === "ACCEPTED",
  );

  const children = acceptedLinks.map((link) => ({
    childId: link.childId,
    childName: getChildDisplayName(link),
    childEmail: getChildEmail(link),
  }));

  const selectedChild =
    children.find((child) => child.childId === selectedChildId) ??
    children[0] ??
    null;

  const handleSelect = (childId: string) => {
    // Delay store update to allow Modal to begin closing.
    // This prevents "Couldn't find a navigation context" errors
    // caused by heavy re-renders or navigation state changes
    // happening in the same frame as a Modal unmount in headerLeft.
    setTimeout(() => {
      setOpen(false);
      setSelectedChild(guardianId, childId);

      // Force revalidate APIs related to the child to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ["progress"] });
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
      queryClient.invalidateQueries({ queryKey: ["stories"] });

      if (onChange) onChange(childId);
    }, 200);
  };

  return (
    <View className={cn("flex-row items-center", className)}>
      <Pressable
        onPress={() => setOpen(true)}
        className="flex-row items-center gap-1.5 px-3 py-1.5 bg-muted/20 rounded-full border border-border/40 active:bg-muted/40"
        accessibilityRole="button"
        accessibilityLabel="Chọn tài khoản bé"
      >
        <View className="size-6 bg-primary/10 rounded-full items-center justify-center">
          <User size={14} className="text-primary" />
        </View>
        <Text className="text-sm font-bold text-foreground" numberOfLines={1}>
          {selectedChild?.childName || "Chọn bé"}
        </Text>
        <ChevronDown size={14} className="text-muted-foreground" />
      </Pressable>

      {rendered && (
        <Modal
          transparent
          visible={rendered}
          animationType="none"
          onRequestClose={() => setOpen(false)}
          statusBarTranslucent
        >
          <View className="flex-1 justify-end">
            <Animated.View
              style={backdropStyle}
              className="absolute inset-0 bg-black/50"
            >
              <Pressable className="flex-1" onPress={() => setOpen(false)} />
            </Animated.View>

            <Animated.View
              style={sheetStyle}
              className="w-full pb-8 pt-3 shadow-2xl shadow-black/20 px-5 bg-card rounded-t-3xl max-h-[85vh]"
            >
              <View className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-border" />

              <View className="flex-row items-start justify-between gap-4 pb-4">
                <View className="flex-1 gap-1">
                  <Text className="text-xl font-bold">Chọn bé đang xem</Text>
                  <Text className="text-sm text-muted-foreground">
                    Dữ liệu thống kê sẽ được hiển thị theo bé bạn chọn.
                  </Text>
                </View>

                <Button
                  size="icon"
                  variant="ghost"
                  onPress={() => setOpen(false)}
                >
                  <Icon as={X} size={18} />
                </Button>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 16 }}
              >
                {linksQuery.isLoading ? (
                  <View className="py-10 items-center">
                    <ActivityIndicator color={theme.primary} />
                  </View>
                ) : children.length === 0 ? (
                  <View className="py-10 items-center px-6">
                    <Text className="text-center text-muted-foreground italic">
                      Bạn chưa có bé nào được liên kết thành công. Hãy vào mục
                      Cài đặt để kết nối nhé!
                    </Text>
                  </View>
                ) : (
                  children.map((item) => {
                    const isActive = item.childId === selectedChildId;
                    return (
                      <Pressable
                        key={item.childId}
                        onPress={() => handleSelect(item.childId)}
                        className={cn(
                          "mb-3 flex-row items-center justify-between p-4 rounded-2xl border-2 transition-all",
                          isActive
                            ? "border-primary bg-primary/5 shadow-sm"
                            : "border-border bg-card active:bg-muted/10",
                        )}
                      >
                        <View className="flex-row items-center gap-3 flex-1">
                          <View
                            className={cn(
                              "size-10 rounded-full items-center justify-center",
                              isActive ? "bg-primary" : "bg-muted",
                            )}
                          >
                            <User
                              size={20}
                              color={isActive ? "white" : theme.mutedForeground}
                            />
                          </View>
                          <View className="flex-1">
                            <Text
                              className={cn(
                                "font-bold text-base",
                                isActive ? "text-primary" : "text-foreground",
                              )}
                            >
                              {item.childName}
                            </Text>
                            <Text
                              className="text-xs text-muted-foreground"
                              numberOfLines={1}
                            >
                              {item.childEmail}
                            </Text>
                          </View>
                        </View>
                        {isActive && (
                          <View className="size-6 bg-primary rounded-full items-center justify-center">
                            <Check size={14} color="white" strokeWidth={3} />
                          </View>
                        )}
                      </Pressable>
                    );
                  })
                )}
              </ScrollView>
            </Animated.View>
          </View>
        </Modal>
      )}
    </View>
  );
}
