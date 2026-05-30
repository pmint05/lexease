import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Separator } from "@/src/components/ui/separator";
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
  useRevokeChildLinkMutation,
} from "@/src/hooks/useFamilyQueries";
import { cn } from "@/src/lib/utils";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useFamilyStore } from "@/src/store/useFamilyStore";
import { useReadingStore } from "@/src/store/useReadingStore";
import { useThemeStore, type ThemePref } from "@/src/store/useThemeStore";
import { useRouter } from "expo-router";
import {
  CheckCircle2,
  Clock,
  LogOut,
  Palette,
  Settings,
  Trash2,
  UserPlus,
} from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";

/**
 * Settings Screen
 * Manage child's reading configuration and guardian preferences
 */
export default function SettingsScreen(): React.ReactElement {
  const { user, logout } = useAuthStore();
  const router = useRouter();
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
  const revokeLinkMutation = useRevokeChildLinkMutation();

  const acceptedLinks = useMemo(() => {
    return (linksQuery.data ?? []).filter((link) => link.status === "ACCEPTED");
  }, [linksQuery.data]);

  const pendingLinks = useMemo(() => {
    return (linksQuery.data ?? []).filter((link) => link.status === "PENDING");
  }, [linksQuery.data]);

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
        onSuccess: () => {
          setChildEmail("");
          linksQuery.refetch();
        },
      },
    );
  };

  const handleLogout = async (): Promise<void> => {
    logout();
    await new Promise((resolve) => setTimeout(resolve, 100));
    router.replace("/(auth)/login");
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
      <ScrollView showsVerticalScrollIndicator={false} className="pb-4">
        <View className="flex-row items-center gap-2 mb-2 pt-4">
          <Settings size={24} className="text-primary" />
          <Text className="text-2xl font-bold">Cài đặt hệ thống</Text>
        </View>

        <View className="gap-4 mt-3 pb-8">
          {/* Reading Interface Settings */}
          <Card className="border border-border bg-card">
            <CardHeader className="pb-2">
              <View className="flex-row justify-between items-center">
                <View className="flex-row gap-2 items-center">
                  <Palette size={20} className="text-primary" />
                  <CardTitle>Giao diện đọc của trẻ</CardTitle>
                </View>
                <Badge variant="secondary">
                  <Text className="text-xs">Tùy chỉnh</Text>
                </Badge>
              </View>
            </CardHeader>
            <CardContent className="gap-3">
              <Text className="text-sm text-muted-foreground">
                Điều chỉnh màu nền, cỡ chữ và font chữ để phù hợp với thị giác
                của trẻ. Các thay đổi sẽ được áp dụng tự động xuống máy của trẻ.
              </Text>
              <View className="flex-row gap-2 mt-1">
                <Button
                  size="sm"
                  disabled={!targetChildId || resetSettingsMutation.isPending}
                  onPress={() => resetSettingsMutation.mutate()}
                >
                  <Text>Mặc định</Text>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={!targetChildId || saveSettingsMutation.isPending}
                  onPress={handleSaveCurrentSettings}
                >
                  <Text>Lưu hiện tại</Text>
                </Button>
              </View>
            </CardContent>
          </Card>

          {/* Child Account Management */}
          <Card className="border border-border bg-card">
            <CardHeader className="pb-2">
              <View className="flex-row gap-2 items-center">
                <UserPlus size={20} className="text-primary" />
                <CardTitle>Quản lý tài khoản bé</CardTitle>
              </View>
            </CardHeader>
            <CardContent className="gap-4">
              {/* Request Form */}
              <View className="gap-2">
                <Text className="text-xs font-medium text-muted-foreground ml-1">
                  Thêm bé mới bằng email
                </Text>
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
                    disabled={
                      requestLinkMutation.isPending || !childEmail.trim()
                    }
                    onPress={handleRequestLink}
                    size="icon"
                  >
                    {requestLinkMutation.isPending ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <UserPlus size={20} className="text-primary-foreground" />
                    )}
                  </Button>
                </View>
              </View>

              <Separator />

              {/* Links List */}
              <View className="gap-3">
                {linksQuery.isLoading ? (
                  <ActivityIndicator size="small" color={theme.primary} />
                ) : (
                  <>
                    {/* Pending Section */}
                    {pendingLinks.length > 0 && (
                      <View className="gap-2">
                        <View className="flex-row items-center gap-1.5 ml-1">
                          <Clock size={14} className="text-muted-foreground" />
                          <Text className="text-sm font-medium text-muted-foreground">
                            Yêu cầu đang chờ
                          </Text>
                        </View>
                        {pendingLinks.map((link) => (
                          <Card
                            key={link.linkId}
                            className="flex-row justify-between items-center bg-muted/30 p-3 rounded-xl"
                          >
                            <View className="flex-1">
                              <Text className="font-medium" numberOfLines={1}>
                                {link.childEmail || "Chưa xác định"}
                              </Text>
                              <Text className="text-xs text-muted-foreground">
                                Chờ bé chấp nhận
                              </Text>
                            </View>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onPress={() =>
                                revokeLinkMutation.mutate(link.linkId)
                              }
                              disabled={revokeLinkMutation.isPending}
                            >
                              <Trash2 size={16} className="text-destructive" />
                            </Button>
                          </Card>
                        ))}
                      </View>
                    )}

                    {/* Linked Section */}
                    <View className="gap-2">
                      <View className="flex-row items-center gap-1.5 ml-1">
                        <CheckCircle2 size={14} className="text-primary" />
                        <Text className="text-sm font-medium text-muted-foreground">
                          Bé đã liên kết
                        </Text>
                      </View>
                      {acceptedLinks.length === 0 ? (
                        <View className="p-4 items-center bg-muted/20 rounded-xl border border-dashed border-border">
                          <Text className="text-sm text-muted-foreground italic text-center">
                            Chưa có bé nào được liên kết. Hãy gửi yêu cầu ở
                            trên!
                          </Text>
                        </View>
                      ) : (
                        acceptedLinks.map((link) => (
                          <View
                            key={link.linkId}
                            className="flex-row justify-between items-center bg-accent/5 p-3 rounded-xl border border-accent/10"
                          >
                            <View className="flex-1">
                              <Text
                                className="font-semibold text-primary"
                                numberOfLines={1}
                              >
                                {link.childEmail || "Đã liên kết"}
                              </Text>
                              <Text className="text-xs text-muted-foreground">
                                Đã kết nối
                              </Text>
                            </View>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onPress={() =>
                                revokeLinkMutation.mutate(link.linkId)
                              }
                              disabled={revokeLinkMutation.isPending}
                            >
                              <Trash2 size={16} className="text-destructive" />
                            </Button>
                          </View>
                        ))
                      )}
                    </View>
                  </>
                )}
              </View>
            </CardContent>
          </Card>

          {/* App Appearance */}
          <Card className="border border-border bg-card">
            <CardHeader className="pb-2">
              <View className="flex-row items-center gap-2">
                <Palette size={20} className="text-primary" />
                <CardTitle>Giao diện ứng dụng</CardTitle>
              </View>
            </CardHeader>
            <CardContent>
              <ThemeModePicker />
            </CardContent>
          </Card>
        </View>

        <View className="mt-4 w-full">
          <Button
            onPress={handleLogout}
            variant="outline"
            className="w-full border-destructive/20 active:bg-destructive/5"
          >
            <LogOut size={18} className="text-destructive mr-2" />
            <Text className="text-destructive font-semibold">Đăng xuất</Text>
          </Button>
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
            variant={active ? "default" : "outline"}
            className="flex-1"
            onPress={() => setTheme(option.value)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
          >
            <Text
              className={cn("text-sm font-medium text-foreground", {
                "text-primary-foreground": active,
              })}
            >
              {option.label}
            </Text>
          </Button>
        );
      })}
    </View>
  );
}
