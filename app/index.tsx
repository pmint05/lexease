import { useAuthStore } from "@/src/store/useAuthStore";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Text, YStack } from "tamagui";

/**
 * Entry Point Screen
 * Redirects based on auth state and user role
 * - Not authenticated → (auth)/login
 * - Child user → (child)/library
 * - Guardian user → (guardian)/dashboard
 */
export default function IndexScreen(): React.ReactElement {
  const router = useRouter();
  const { token, role, user } = useAuthStore();
  const effectiveRole = role ?? user?.role ?? null;

  useEffect(() => {
    // Redirect based on auth state
    if (!token) {
      router.replace("/(auth)/login");
    } else if (effectiveRole === "child") {
      router.replace("/(child)/(tabs)/library");
    } else if (effectiveRole === "guardian") {
      router.replace("/(guardian)/(tabs)/dashboard");
    } else {
      router.replace("/(auth)/login");
    }
  }, [token, effectiveRole, router]);

  // Show minimal UI while redirecting
  return (
    <YStack
      flex={1}
      justifyContent="center"
      alignItems="center"
      backgroundColor="$background"
    >
      <Text>Loading LexEase...</Text>
    </YStack>
  );
}
