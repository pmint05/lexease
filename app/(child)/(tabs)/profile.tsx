import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Text } from "@/src/components/ui/text";
import {
  useAcceptChildLinkMutation,
  useGuardianChildLinksQuery,
  useRejectChildLinkMutation,
} from "@/src/hooks/useFamilyQueries";
import { useNotificationService } from "@/src/hooks/useNotificationService";
import { useProgressSummaryQuery } from "@/src/hooks/useProgressQueries";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useThemeStore } from "@/src/store/useThemeStore";
import { useRouter } from "expo-router";
import {
  Bell,
  Edit2,
  LogOut,
  Monitor,
  Moon,
  Sun,
  UserCheck,
  UserX,
} from "lucide-react-native";
import React, { useMemo } from "react";
import { ActivityIndicator, Alert, ScrollView, View } from "react-native";

/**
 * Child Profile Screen
 * Displays:
 * - User info & Avatar
 * - Reward points
 * - Summary statistics
 * - Pending invitations from guardians
 * - Logout button
 */
export default function ProfileScreen(): React.ReactElement {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const summaryQuery = useProgressSummaryQuery(user?.id ?? "");

  const linksQuery = useGuardianChildLinksQuery();
  const acceptMutation = useAcceptChildLinkMutation();
  const rejectMutation = useRejectChildLinkMutation();

  const acceptedLinks = useMemo(() => {
    return (linksQuery.data ?? []).filter((link) => link.status === "ACCEPTED");
  }, [linksQuery.data]);

  const isLinked = useMemo(() => {
    return acceptedLinks.some((l) => l.childId === user?.id);
  }, [acceptedLinks, user?.id]);

  const handleLogout = async () => {
    logout();
    await new Promise((resolve) => setTimeout(resolve, 100));
    router.replace("/(auth)/login");
  };

  const pendingInvitations = useMemo(() => {
    return (linksQuery.data ?? []).filter(
      (link) => link.status === "PENDING" && link.childId === user?.id,
    );
  }, [linksQuery.data, user?.id]);

  const summary = summaryQuery.data;
  const { sendTestNotification, requestPermissions } = useNotificationService();

  return (
    <View className="flex-1 bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-4 pt-6 pb-10">
          {/* Header */}
          <View className="flex-row items-center justify-between gap-4">
            <View className="flex-row items-center gap-3">
              <Avatar alt={user?.name ?? "Avatar"} className="size-14">
                {user?.avatarUrl ? (
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore rn-avatar Image props
                  <AvatarImage source={{ uri: user.avatarUrl }} />
                ) : (
                  <AvatarFallback className="bg-primary/10">
                    <Text className="text-primary font-bold text-lg">
                      {user?.name?.[0] ?? "B"}
                    </Text>
                  </AvatarFallback>
                )}
              </Avatar>
              <View>
                <View className="flex-row items-center gap-2">
                  <Text className="text-xl font-bold text-foreground">
                    {user?.name || "Bé LexEase"}
                  </Text>
                  {isLinked ? (
                    <Badge className="bg-primary/10 border-primary/20">
                      <Text className="text-xs text-primary font-semibold">
                        Đã liên kết
                      </Text>
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <Text className="text-xs">Chưa liên kết</Text>
                    </Badge>
                  )}
                </View>
                <Text className="text-sm text-muted-foreground">
                  {user?.email}
                </Text>
              </View>
            </View>

            <Button
              size="icon"
              variant="ghost"
              className="rounded-full bg-muted/30"
              onPress={() => router.push("/(child)/profile/edit" as any)}
            >
              <Edit2 size={18} className="text-muted-foreground" />
            </Button>
          </View>

          {/* Pending Invitations Section */}
          {pendingInvitations.length > 0 && (
            <View className="mt-6">
              <View className="flex-row items-center gap-2 mb-3">
                <Bell size={18} className="text-primary" />
                <Text className="font-bold text-lg">Lời mời kết nối</Text>
              </View>
              <View className="gap-3">
                {pendingInvitations.map((invite) => (
                  <Card
                    key={invite.linkId}
                    className="!border-primary/20 !bg-primary/5"
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">
                        Phụ huynh muốn kết nối
                      </CardTitle>
                      <CardDescription>
                        Email: {invite.guardianEmail || "Một phụ huynh"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-row gap-2">
                      <Button
                        className="flex-1 bg-primary"
                        size="sm"
                        onPress={() =>
                          acceptMutation.mutate(invite.linkId, {
                            onSuccess: () => linksQuery.refetch(),
                          })
                        }
                        disabled={
                          acceptMutation.isPending || rejectMutation.isPending
                        }
                      >
                        {acceptMutation.isPending ? (
                          <ActivityIndicator size="small" color="white" />
                        ) : (
                          <>
                            <UserCheck
                              size={16}
                              className="text-primary-foreground mr-1"
                            />
                            <Text>Đồng ý</Text>
                          </>
                        )}
                      </Button>
                      <Button
                        className="flex-1"
                        variant="outline"
                        size="sm"
                        onPress={() =>
                          rejectMutation.mutate(invite.linkId, {
                            onSuccess: () => linksQuery.refetch(),
                          })
                        }
                        disabled={
                          acceptMutation.isPending || rejectMutation.isPending
                        }
                      >
                        <UserX size={16} className="text-destructive mr-1" />
                        <Text>Từ chối</Text>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </View>
            </View>
          )}

          {/* Stats Row */}
          <View className="mt-6 flex-row gap-3">
            <Card className="flex-1 p-3 items-center gap-0">
              <Text className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                Sách
              </Text>
              {summaryQuery.isLoading ? (
                <Skeleton className="h-8 w-10 mt-1" />
              ) : (
                <Text className="text-2xl font-extrabold text-foreground mt-1">
                  {summary?.completedSessionsCount ?? 0}
                </Text>
              )}
            </Card>
            <Card className="flex-1 p-3 items-center gap-0">
              <Text className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                Phút
              </Text>
              {summaryQuery.isLoading ? (
                <Skeleton className="h-8 w-10 mt-1" />
              ) : (
                <Text className="text-2xl font-extrabold text-foreground mt-1">
                  {summary?.totalPracticeMinutes ?? 0}
                </Text>
              )}
            </Card>
            <Card className="flex-1 p-3 items-center gap-0">
              <Text className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                Phiên
              </Text>
              {summaryQuery.isLoading ? (
                <Skeleton className="h-8 w-10 mt-1" />
              ) : (
                <Text className="text-2xl font-extrabold text-foreground mt-1">
                  {summary?.sessionsCount ?? 0}
                </Text>
              )}
            </Card>
          </View>

          {/* Actions */}
          <View className="mt-4 gap-4">
            <Text className="font-bold text-lg ml-1">Cài đặt & Tài khoản</Text>
            <ThemeToggle />

            <Button
              onPress={async () => {
                const granted = await requestPermissions();
                if (!granted) {
                  Alert.alert("Thông báo", "Vui lòng cấp quyền thông báo trong cài đặt để nhận nhắc nhở học tập.");
                }
              }}
              variant="outline"
              className="w-full bg-primary/5 border-primary/20"
            >
              <Bell size={18} className="text-primary mr-2" />
              <Text className="text-primary font-semibold">Cấu hình thông báo</Text>
            </Button>

            <Button
              onPress={async () => {
                await sendTestNotification();
              }}
              className="w-full"
            >
              <Text>Bấm để Test thông báo (5s sau)</Text>
            </Button>

            <Button
              onPress={handleLogout}
              variant="outline"
              className="w-full border-destructive/20 active:bg-destructive/5"
            >
              <LogOut size={18} className="text-destructive mr-2" />
              <Text className="text-destructive font-semibold">Đăng xuất</Text>
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function ThemeToggle(): React.ReactElement {
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
      className="w-full justify-between px-4 bg-muted/20 border-transparent"
      variant="outline"
      onPress={() => setTheme(next(theme))}
    >
      <View className="flex-row items-center gap-3">
        {icon}
        <Text className="font-medium">{label}</Text>
      </View>
      <View className="size-2 rounded-full bg-primary" />
    </Button>
  );
}
