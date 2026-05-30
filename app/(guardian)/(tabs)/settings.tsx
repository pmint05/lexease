import { Button } from "@/src/components/shared/Button";
import { Card } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Text } from "@/src/components/ui/text";
import {
  useDisplaySettingsQuery,
  useResetDisplaySettingsMutation,
  useSaveDisplaySettingsMutation,
} from "@/src/hooks/useDisplaySettingsQueries";
import { useEffectiveTheme } from "@/src/hooks/useEffectiveTheme";
import {
  useGuardianChildLinksQuery,
  useRequestChildLinkMutation,
} from "@/src/hooks/useFamilyQueries";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useFamilyStore } from "@/src/store/useFamilyStore";
import { useReadingStore } from "@/src/store/useReadingStore";
import { useThemeStore, type ThemePref } from "@/src/store/useThemeStore";
import { Palette, Settings } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { ScrollView, View } from "react-native";

/**
 * Settings Screen
 * Manage child's reading configuration and guardian preferences
 */
export default function SettingsScreen(): React.ReactElement {
  const { user } = useAuthStore();
  const guardianId = user?.id ?? "";
  const { theme } = useEffectiveTheme();
  const selectedChildId = useFamilyStore((state) =>
    guardianId ? state.getSelectedChildId(guardianId) : null,
  );
  const {
    fontSize,
    fontFamily,
    backgroundColor,
    textColor,
    highlightBackgroundColor,
    highlightTextColor,
    lineHeight,
    letterSpacing,
  } = useReadingStore();
  const [childEmail, setChildEmail] = useState("");
  const linksQuery = useGuardianChildLinksQuery();
  const requestLinkMutation = useRequestChildLinkMutation();

  const acceptedLinks = useMemo(() => {
    return (linksQuery.data ?? []).filter(
      (link) => link.guardianId === guardianId && link.status === "ACCEPTED",
    );
  }, [guardianId, linksQuery.data]);
  const targetChildId = selectedChildId ?? acceptedLinks[0]?.childId ?? "";
  useDisplaySettingsQuery(targetChildId || undefined);
  const saveSettingsMutation = useSaveDisplaySettingsMutation(targetChildId);
  const resetSettingsMutation = useResetDisplaySettingsMutation(targetChildId);

  const handleRequestLink = (): void => {
    const trimmedEmail = childEmail.trim();
    if (!trimmedEmail) return;

    requestLinkMutation.mutate(
      { childEmail: trimmedEmail },
      {
        onSuccess: () => setChildEmail(""),
      },
    );
  };

  const handleSaveCurrentSettings = (): void => {
    if (!targetChildId) return;

    saveSettingsMutation.mutate({
      fontFamily,
      fontSize,
      lineHeight,
      letterSpacing: fontSize > 0 ? letterSpacing / fontSize : 0.04,
      backgroundColor,
      textColor,
      highlightBackgroundColor,
      highlightTextColor,
      themeName: "guardian-current",
    });
  };

  return (
    <View className="flex-1 bg-background px-4">
      <ScrollView>
        <View className="flex-row items-center gap-2 mb-2 pt-4">
          <Settings size={24} color={theme.primary} />
          <Text className="text-2xl font-bold">Cài đặt hệ thống</Text>
        </View>

        <View className="gap-4 mt-3">
          <Card className="p-4 border border-border bg-background">
            <View className="gap-3">
              <View className="flex-row justify-between items-center">
                <View className="flex-row gap-2 items-center">
                  <Palette size={20} color={theme.primary} />
                  <Text className="font-semibold">Giao diện đọc của trẻ</Text>
                </View>
                <Text className="text-primary font-bold">Tùy chỉnh</Text>
              </View>

              <View className="gap-2">
                <Text className="text-sm text-muted-foreground">
                  Điều chỉnh màu nền, cỡ chữ và font chữ để phù hợp với thị giác
                  của trẻ. Các thay đổi sẽ được áp dụng tự động xuống máy của
                  trẻ.
                </Text>
                <View className="flex-row gap-2 mt-2">
                  <Button
                    size="$3"
                    disabled={!targetChildId || resetSettingsMutation.isPending}
                    onPress={() => resetSettingsMutation.mutate()}
                  >
                    Mặc định
                  </Button>
                  <Button
                    size="$3"
                    variant="outlined"
                    disabled={!targetChildId || saveSettingsMutation.isPending}
                    onPress={handleSaveCurrentSettings}
                  >
                    Lưu hiện tại
                  </Button>
                </View>
              </View>
            </View>
          </Card>

          <Card className="p-4 border border-border bg-background">
            <View className="gap-3">
              <Text className="font-semibold">Liên kết tài khoản bé</Text>
              <View className="flex-row gap-2 items-center">
                <Input
                  className="flex-1"
                  value={childEmail}
                  onChangeText={setChildEmail}
                  placeholder="email-cua-be@example.com"
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
                <Button
                  disabled={requestLinkMutation.isPending}
                  onPress={handleRequestLink}
                >
                  Gửi
                </Button>
              </View>
              <Text className="text-sm text-muted-foreground">
                {requestLinkMutation.isSuccess
                  ? "Đã gửi yêu cầu liên kết."
                  : "Bé hoặc phụ huynh đã được chấp nhận cần duyệt yêu cầu này."}
              </Text>
            </View>
          </Card>

          <Card className="p-4 border border-border bg-background">
            <View className="gap-3">
              <View className="flex-row items-center justify-between gap-3">
                <View className="flex-row items-center gap-2">
                  <Palette size={20} color={theme.primary} />
                  <Text className="font-semibold">Giao diện ứng dụng</Text>
                </View>
              </View>

              <ThemeModePicker />
            </View>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

function ThemeModePicker(): React.ReactElement {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);

  const options: { value: ThemePref; label: string }[] = [
    { value: "system", label: "Hệ thống" },
    { value: "light", label: "Sáng" },
    { value: "dark", label: "Tối" },
  ];

  return (
    <View className="flex-row gap-2">
      {options.map((option) => {
        const active = theme === option.value;

        return (
          <Button
            key={option.value}
            size="sm"
            uiVariant={active ? "primary" : "outline"}
            className="flex-1"
            onPress={() => setTheme(option.value)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
          >
            {option.label}
          </Button>
        );
      })}
    </View>
  );
}
