import LoadingScreen from "@/src/components/feedback/loading-screen";
import { useAuthStore } from "@/src/store/useAuthStore";
import { Redirect, Stack } from "expo-router";
import React from "react";

/**
 * Auth Route Group Layout
 * Protects auth routes from logged-in users
 */
export default function AuthLayout(): React.ReactElement {
  const { token, role, _hasHydrated } = useAuthStore();

  // Wait for hydration
  if (!_hasHydrated) return <LoadingScreen />;

  // If already logged in, redirect away from auth pages
  if (token) {
    if (role === "child") {
      return <Redirect href="/(child)/(tabs)/library" />;
    }
    if (role === "guardian") {
      return <Redirect href="/(guardian)/(tabs)/dashboard" />;
    }
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="forgot-password" />
    </Stack>
  );
}
