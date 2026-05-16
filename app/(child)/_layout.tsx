import LoadingScreen from "@/src/components/feedback/loading-screen";
import { useAuthStore } from "@/src/store/useAuthStore";
import { Redirect, Stack } from "expo-router";
import React from "react";

/**
 * Child Route Group Layout
 * Protects child routes from unauthorized access
 */
export default function ChildLayout(): React.ReactElement {
  const { token, role, _hasHydrated } = useAuthStore();

  if (!_hasHydrated) return <LoadingScreen />;

  // Protect route
  if (!token || role !== "child") {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="reading/[id]" />
      <Stack.Screen name="book/[id]" />
    </Stack>
  );
}
