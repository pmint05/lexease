import LoadingScreen from "@/src/components/feedback/loading-screen";
import { useAuthStore } from "@/src/store/useAuthStore";
import { Redirect, Stack } from "expo-router";
import React from "react";
import { useFamilyStore } from "@/src/store/useFamilyStore";
import { useSyncNotifications } from "@/src/hooks/useNotificationService";

/**
 * Guardian Route Group Layout
 * Protects guardian routes from unauthorized access
 */
export default function GuardianLayout(): React.ReactElement {
  const { token, role, user, _hasHydrated } = useAuthStore();
  
  const selectedChildId = useFamilyStore((state) => 
    user?.id ? state.getSelectedChildId(user.id) : null
  );

  // Sync notifications for the selected child (on the guardian's device)
  useSyncNotifications(role === "guardian" ? selectedChildId : null);

  if (!_hasHydrated) return <LoadingScreen />;

  // Protect route
  if (!token || role !== "guardian") {
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
      <Stack.Screen name="book/[id]" />
    </Stack>
  );
}
