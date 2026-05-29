import { Button } from "@/src/components/shared/Button";
import { Card } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Switch } from "@/src/components/ui/switch";
import { Text } from "@/src/components/ui/text";
import {
    useDisplaySettingsQuery,
    useResetDisplaySettingsMutation,
    useSaveDisplaySettingsMutation,
} from "@/src/hooks/useDisplaySettingsQueries";
import {
    useGuardianChildLinksQuery,
    useRequestChildLinkMutation,
} from "@/src/hooks/useFamilyQueries";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useFamilyStore } from "@/src/store/useFamilyStore";
import { useReadingStore } from "@/src/store/useReadingStore";
import { Palette, Settings, ShieldCheck } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { ScrollView, View } from "react-native";

/**
 * Settings Screen
 * Manage child's reading configuration and guardian preferences
 */
export default function SettingsScreen(): React.ReactElement {
  const { user } = useAuthStore();
  const guardianId = user?.id ?? "";
  const selectedChildId = useFamilyStore((state) =>
    guardianId ? state.getSelectedChildId(guardianId) : null,
  );
  const {
    fontSize,
    fontFamily,
    backgroundColor,
    textColor,
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
      themeName: "guardian-current",
    });
  };

  return (
    <ScrollView>
      <View className="bg-background px-4">
        <View className="flex-row items-center gap-2 mb-2 pt-4">
          <Settings size={24} color="#0066CC" />
          <Text className="text-2xl font-bold">Cài đặt hệ thống</Text>
        </View>

        <View className="gap-4">
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
              <Text className="text-sm text-muted">
                {requestLinkMutation.isSuccess
                  ? "Đã gửi yêu cầu liên kết."
                  : "Bé hoặc phụ huynh đã được chấp nhận cần duyệt yêu cầu này."}
              </Text>
            </View>
          </Card>

          <Text className="font-bold text-lg text-muted">
            Cấu hình phiên đọc cho con
          </Text>

          <Card className="p-4 border border-border bg-background">
            <View className="gap-4">
              <View className="flex-row justify-between items-center">
                <View className="flex-row gap-2 items-center">
                  <Palette size={20} color="#0066CC" />
                  <Text className="font-semibold">Giao diện đọc</Text>
                </View>
                <Text className="text-primary font-bold">Tùy chỉnh</Text>
              </View>

              <View className="gap-2">
                <Text className="text-sm text-muted">
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
            <View className="gap-4">
              <View className="flex-row justify-between items-center">
                <View className="flex-row gap-2 items-center">
                  <ShieldCheck size={20} color="#00A676" />
                  <Text className="font-semibold">
                    Quyền riêng tư & Bảo mật
                  </Text>
                </View>
              </View>

              <View className="flex-row justify-between items-center">
                <Label className="flex-1 text-base">Ghi âm tự động</Label>
                <Switch checked={true} onCheckedChange={() => {}} />
              </View>

              <View className="flex-row justify-between items-center">
                <Label className="flex-1 text-base">
                  Báo cáo hàng tuần qua Email
                </Label>
                <Switch checked={false} onCheckedChange={() => {}} />
              </View>
            </View>
          </Card>

          <Button variant="outlined" className="mt-4">
            Xóa toàn bộ lịch sử đọc
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}
