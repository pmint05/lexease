import { COLORS } from "@/src/core/constants/colors";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useLearningStore } from "@/src/store/useLearningStore";
import { useRouter } from "expo-router";
import {
  Award,
  BookOpen,
  Clock,
  LogOut,
  User as UserIcon,
} from "lucide-react-native";
import React, { useMemo } from "react";
import { ScrollView } from "react-native";
import {
  Avatar,
  Button,
  Card,
  H3,
  Separator,
  Text,
  XStack,
  YStack,
} from "tamagui";

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
    <YStack flex={1} backgroundColor="$background">
      <ScrollView showsVerticalScrollIndicator={false}>
        <YStack
          paddingHorizontal="$4"
          paddingTop="$6"
          gap="$6"
          paddingBottom="$10"
        >
          {/* 1. Profile Header */}
          <XStack alignItems="center" gap="$4">
            <Avatar circular size="$8" borderColor="$border">
              <Avatar.Image
                source={{
                  uri:
                    user?.avatarUrl ||
                    "https://placehold.co/100x100/A5D6A7/333333?text=Bé",
                }}
              />
              <Avatar.Fallback backgroundColor="$color5" />
            </Avatar>
            <YStack gap="$1">
              <H3 fontWeight="800">{user?.name || "Bé LexEase"}</H3>
              <Text color="$mutedForeground" fontSize="$3">
                {user?.email}
              </Text>
              <XStack
                backgroundColor="$color3"
                paddingHorizontal="$3"
                paddingVertical="$1"
                borderRadius="$10"
                alignItems="center"
                gap="$1.5"
                marginTop="$1"
              >
                <Award size={14} color="$primary" />
                <Text fontSize="$2" fontWeight="700" color="$primary">
                  Hạng: Người khám phá
                </Text>
              </XStack>
            </YStack>
          </XStack>

          {/* 2. Points Section */}
          <Card padding="$4" backgroundColor="$primary">
            <XStack justifyContent="space-between" alignItems="center">
              <YStack gap="$1">
                <Text color="white" opacity={0.8} fontWeight="600">
                  Điểm thưởng hiện tại
                </Text>
                <H3 color="white" fontWeight="900">
                  {userPoints.toLocaleString()} Xu
                </H3>
              </YStack>
              <YStack
                backgroundColor="rgba(255,255,255,0.2)"
                padding="$3"
                borderRadius="$5"
              >
                <Award size={32} color="white" />
              </YStack>
            </XStack>
            <Separator
              marginVertical="$3"
              backgroundColor="rgba(255,255,255,0.1)"
            />
            <Text color="white" fontSize="$2" textAlign="center">
              Đọc thêm sách để tích lũy thêm nhiều Xu nhé!
            </Text>
          </Card>

          {/* 3. Quick Stats */}
          <YStack gap="$3">
            <Text fontSize="$5" fontWeight="700">
              Thành tích của bé
            </Text>
            <XStack gap="$3">
              <Card flex={1} padding="$4" alignItems="center" gap="$2">
                <BookOpen size={24} color={COLORS.primary} />
                <Text fontSize="$8" fontWeight="800">
                  {statistics.booksRead}
                </Text>
                <Text fontSize="$1" color="$mutedForeground" textAlign="center">
                  Sách đã đọc
                </Text>
              </Card>
              <Card flex={1} padding="$4" alignItems="center" gap="$2">
                <Clock size={24} color={COLORS.primary} />
                <Text fontSize="$8" fontWeight="800">
                  {statistics.totalMinutes}
                </Text>
                <Text fontSize="$1" color="$mutedForeground" textAlign="center">
                  Phút luyện tập
                </Text>
              </Card>
              <Card flex={1} padding="$4" alignItems="center" gap="$2">
                <Award size={24} color={COLORS.success} />
                <Text fontSize="$8" fontWeight="800">
                  {statistics.totalSessions}
                </Text>
                <Text fontSize="$1" color="$mutedForeground" textAlign="center">
                  Phiên học
                </Text>
              </Card>
            </XStack>
          </YStack>

          {/* 4. Settings & Actions */}
          <YStack gap="$2" marginTop="$4">
            <Button
              size="$5"
              variant="outlined"
              icon={<UserIcon size={20} />}
              justifyContent="flex-start"
            >
              Chỉnh sửa thông tin
            </Button>
            <Separator marginVertical="$2" />
            <Button
              size="$5"
              variant="outlined"
              icon={<LogOut size={20} />}
              onPress={handleLogout}
              justifyContent="flex-start"
            >
              Đăng xuất
            </Button>
          </YStack>
        </YStack>
      </ScrollView>
    </YStack>
  );
}
