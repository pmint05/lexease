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
import {
    Button,
    Card,
    Input,
    Label,
    ScrollView,
    Switch,
    Text,
    XStack,
    YStack,
} from "tamagui";

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
  const { fontSize, fontFamily, backgroundColor, textColor, lineHeight, letterSpacing } =
    useReadingStore();
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
    <ScrollView backgroundColor="$background">
      <YStack paddingHorizontal="$4" gap="$4">
        <XStack gap="$2" alignItems="center" marginBottom="$2" paddingTop="$4">
          <Settings size={24} color="$primary" />
          <Text fontSize="$6" fontWeight="700">
            Cài đặt hệ thống
          </Text>
        </XStack>

        <YStack gap="$4">
          <Card
            padding="$4"
            borderWidth={1}
            borderColor="$border"
            backgroundColor="$background"
          >
            <YStack gap="$3">
              <Text fontWeight="600">Liên kết tài khoản bé</Text>
              <XStack gap="$2" alignItems="center">
                <Input
                  flex={1}
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
              </XStack>
              <Text fontSize="$3" color="$mutedForeground">
                {requestLinkMutation.isSuccess
                  ? "Đã gửi yêu cầu liên kết."
                  : "Bé hoặc phụ huynh đã được chấp nhận cần duyệt yêu cầu này."}
              </Text>
            </YStack>
          </Card>

          <Text fontWeight="700" fontSize="$5" color="$mutedForeground">
            Cấu hình phiên đọc cho con
          </Text>

          <Card
            padding="$4"
            borderWidth={1}
            borderColor="$border"
            backgroundColor="$background"
          >
            <YStack gap="$4">
              <XStack justifyContent="space-between" alignItems="center">
                <XStack gap="$2" alignItems="center">
                  <Palette size={20} color="$primary" />
                  <Text fontWeight="600">Giao diện đọc</Text>
                </XStack>
                <Text color="$primary" fontWeight="700">
                  Tùy chỉnh
                </Text>
              </XStack>

              <YStack gap="$2">
                <Text fontSize="$3" color="$mutedForeground">
                  Điều chỉnh màu nền, cỡ chữ và font chữ để phù hợp với thị giác
                  của trẻ. Các thay đổi sẽ được áp dụng tự động xuống máy của
                  trẻ.
                </Text>
                <XStack gap="$2" marginTop="$2">
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
                </XStack>
              </YStack>
            </YStack>
          </Card>

          <Card
            padding="$4"
            borderWidth={1}
            borderColor="$border"
            backgroundColor="$background"
          >
            <YStack gap="$4">
              <XStack justifyContent="space-between" alignItems="center">
                <XStack gap="$2" alignItems="center">
                  <ShieldCheck size={20} color="$accent" />
                  <Text fontWeight="600">Quyền riêng tư & Bảo mật</Text>
                </XStack>
              </XStack>

              <XStack justifyContent="space-between" alignItems="center">
                <Label flex={1} fontSize="$4">
                  Ghi âm tự động
                </Label>
                <Switch defaultChecked size="$3">
                  <Switch.Thumb />
                </Switch>
              </XStack>

              <XStack justifyContent="space-between" alignItems="center">
                <Label flex={1} fontSize="$4">
                  Báo cáo hàng tuần qua Email
                </Label>
                <Switch size="$3">
                  <Switch.Thumb />
                </Switch>
              </XStack>
            </YStack>
          </Card>
        </YStack>

        <Button variant="outlined" marginTop="$4">
          Xóa toàn bộ lịch sử đọc
        </Button>
      </YStack>
    </ScrollView>
  );
}
