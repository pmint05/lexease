import { useAuthStore } from "@/src/store/useAuthStore";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Button, Text, YStack } from "tamagui";

/**
 * Role Selection Screen
 * Allows user to select between Child and Guardian roles
 */
export default function RoleSelectionScreen(): React.ReactElement {
  const router = useRouter();
  const { role, user } = useAuthStore();
  const fixedRole = role ?? user?.role ?? null;

  useEffect(() => {
    if (fixedRole === "child") {
      router.replace("/(child)/(tabs)/library");
    } else if (fixedRole === "guardian") {
      router.replace("/(guardian)/(tabs)/dashboard");
    }
  }, [fixedRole, router]);

  return (
    <YStack
      flex={1}
      justifyContent="center"
      alignItems="center"
      padding="$4"
      backgroundColor="$background"
      gap="$6"
    >
      <Text fontSize="$7" fontWeight="bold" accessibilityRole="header">
        Vai trò đã cố định theo tài khoản
      </Text>

      <Text color="$color10" textAlign="center" maxWidth={320}>
        Bạn không thể đổi role trong màn này. Hãy đăng nhập bằng tài khoản khác nếu
        cần truy cập role khác.
      </Text>

      <Button
        onPress={() => router.replace("/(auth)/login")}
        size="$5"
        width={200}
        accessible
        accessibilityRole="button"
        accessibilityLabel="Quay về đăng nhập"
      >
        Về đăng nhập
      </Button>
    </YStack>
  );
}
