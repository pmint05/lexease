import { useConfigStore } from "@/src/store/useConfigStore";
import { Palette, Settings, ShieldCheck } from "lucide-react-native";
import React from "react";
import {
  Button,
  Card,
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
  const { fontSize, fontFamily, backgroundColor, textColor, setConfig } =
    useConfigStore();

  return (
    <ScrollView
      backgroundColor="$background"
      contentContainerStyle={{ paddingVertical: 16 }}
    >
      <YStack paddingHorizontal="$4" gap="$4">
        <XStack gap="$2" alignItems="center" marginBottom="$2">
          <Settings size={24} color="$primary" />
          <Text fontSize="$6" fontWeight="700">
            Cài đặt hệ thống
          </Text>
        </XStack>

        <YStack gap="$4">
          <Text fontWeight="700" fontSize="$5" color="$mutedForeground">
            Cấu hình phiên đọc cho con
          </Text>

          <Card padding="$4" bordered backgroundColor="$background">
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
                  <Button size="$3" theme="active">
                    Mặc định
                  </Button>
                  <Button size="$3" variant="outline">
                    Ban đêm
                  </Button>
                </XStack>
              </YStack>
            </YStack>
          </Card>

          <Card padding="$4" bordered backgroundColor="$background">
            <YStack gap="$4">
              <XStack justifyContent="space-between" alignItems="center">
                <XStack gap="$2" alignItems="center">
                  <ShieldCheck size={20} color="$accent" />
                  <Text fontWeight="600">Quyền riêng tư & Bảo mật</Text>
                </XStack>
              </XStack>

              <XStack justifyContent="space-between" alignItems="center">
                <Label f={1} fontSize="$4">
                  Ghi âm tự động
                </Label>
                <Switch defaultChecked size="$3">
                  <Switch.Thumb />
                </Switch>
              </XStack>

              <XStack justifyContent="space-between" alignItems="center">
                <Label f={1} fontSize="$4">
                  Báo cáo hàng tuần qua Email
                </Label>
                <Switch size="$3">
                  <Switch.Thumb />
                </Switch>
              </XStack>
            </YStack>
          </Card>
        </YStack>

        <Button theme="destructive" variant="outline" marginTop="$4">
          Xóa toàn bộ lịch sử đọc
        </Button>
      </YStack>
    </ScrollView>
  );
}
