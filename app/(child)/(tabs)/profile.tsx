import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Separator } from "@/src/components/ui/separator";
import { Text } from "@/src/components/ui/text";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useLearningStore } from "@/src/store/useLearningStore";
import { useThemeStore } from "@/src/store/useThemeStore";
import { useRouter } from "expo-router";
import { Monitor, Moon, Sun } from "lucide-react-native";
import React, { useMemo } from "react";
import { ScrollView, View } from "react-native";

/**
 * Child Profile Screen
 * Displays:
 * - User info & Avatar
 * - Reward points
 * - Summary statistics
 * - Logout button
 */
export default function ProfileScreen(): React.ReactElement {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { sessions } = useLearningStore();

  const handleLogout = async () => {
    logout();
    await new Promise((resolve) => setTimeout(resolve, 100));
    router.replace("/(auth)/login");
  };

  const statistics = useMemo(() => {
    const totalMinutes = Math.round(
      sessions.reduce((sum, s) => sum + s.durationMs, 0) / 60000,
    );
    const booksRead = new Set(sessions.map((s) => s.bookId)).size;

    return {
      totalMinutes,
      booksRead,
      totalSessions: sessions.length,
    };
  }, [sessions]);

  // Giả lập điểm thưởng (trong thực tế sẽ lấy từ User object)
  const userPoints = user?.points ?? 1250;

  return (
    <View className="flex-1 bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-4 pt-6 pb-10">
          {/* Header */}
          <View className="flex-row items-center justify-between gap-4">
            <View className="flex-row items-center gap-3">
              <Avatar alt={user?.name ?? "Avatar"} className="size-12">
                {user?.avatarUrl ? (
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore rn-avatar Image props
                  <AvatarImage source={{ uri: user.avatarUrl }} />
                ) : (
                  <AvatarFallback>{user?.name?.[0] ?? "B"}</AvatarFallback>
                )}
              </Avatar>
              <View>
                <Text className="text-lg font-bold">
                  {user?.name || "Bé LexEase"}
                </Text>
                <Text className="text-sm text-muted-foreground">
                  {user?.email}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                className="px-3"
                onPress={() => router.push("/(child)/profile/edit" as any)}
              >
                <Text className="text-sm">Chỉnh sửa</Text>
              </Button>
            </View>
          </View>

          {/* Stats Row */}
          <View className="mt-5 grid grid-cols-3 gap-3">
            <Card className="p-3 items-center">
              <Text className="text-sm text-muted-foreground">Sách</Text>
              <Text className="text-xl font-extrabold">
                {statistics.booksRead}
              </Text>
            </Card>
            <Card className="p-3 items-center">
              <Text className="text-sm text-muted-foreground">Phút</Text>
              <Text className="text-xl font-extrabold">
                {statistics.totalMinutes}
              </Text>
            </Card>
            <Card className="p-3 items-center">
              <Text className="text-sm text-muted-foreground">Phiên</Text>
              <Text className="text-xl font-extrabold">
                {statistics.totalSessions}
              </Text>
            </Card>
          </View>

          {/* Points */}
          <Card className="mt-4 p-4">
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-sm text-muted-foreground">
                  Điểm thưởng
                </Text>
                <Text className="text-2xl font-extrabold text-primary">
                  {userPoints.toLocaleString()} Xu
                </Text>
              </View>
              <Badge variant="outline">
                <Text>Hạng: Khám phá</Text>
              </Badge>
            </View>
            <Text className="mt-3 text-sm text-muted-foreground">
              Đọc thêm sách để nhận thêm Xu và huy hiệu!
            </Text>
          </Card>

          {/* Actions */}
          <View className="mt-6 space-y-3">
            <ThemeToggle className="w-full" />
            <Separator />
            <Button
              onPress={handleLogout}
              variant="destructive"
              className="w-full justify-center"
            >
              Đăng xuất
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function ThemeToggle({
  className,
}: {
  className?: string;
}): React.ReactElement {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);

  const next = (t: string) => {
    if (t === "system") return "light";
    if (t === "light") return "dark";
    return "system";
  };

  const icon =
    theme === "system" ? (
      <Monitor size={18} className="text-foreground" />
    ) : theme === "light" ? (
      <Sun size={18} className="text-foreground" />
    ) : (
      <Moon size={18} className="text-foreground" />
    );
  const label =
    theme === "system"
      ? "Giao diện: Hệ thống"
      : theme === "light"
        ? "Giao diện: Sáng"
        : "Giao diện: Tối";

  return (
    <Button
      className={`${className ?? ""} justify-center`}
      variant="outline"
      onPress={() => setTheme(next(theme))}
    >
      <View className="flex-row items-center gap-2">
        {icon}
        <Text>{label}</Text>
      </View>
    </Button>
  );
}
