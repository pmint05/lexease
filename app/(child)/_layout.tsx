import LoadingScreen from "@/src/components/feedback/loading-screen";
import { useAuthStore } from "@/src/store/useAuthStore";
import { Redirect, Stack } from "expo-router";
import React from "react";
import { useSyncNotifications } from "@/src/hooks/useNotificationService";

/**
 * Child Route Group Layout
 * Protects child routes from unauthorized access
 */
export default function ChildLayout(): React.ReactElement {
  const { token, role, user, _hasHydrated } = useAuthStore();

  // Sync notifications for the child
  useSyncNotifications(role === "child" ? user?.id ?? null : null);

  if (!_hasHydrated) return <LoadingScreen />;

  // Protect route
  if (!token || role !== "child") {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "none",
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="reading/[id]" />
      <Stack.Screen
        name="reading/result"
        options={{
          animation: "fade",
          gestureEnabled: false,
        }}
      />
      <Stack.Screen name="book/[id]" />
    </Stack>
  );
}
