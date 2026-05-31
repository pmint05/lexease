import { Text } from "@/src/components/ui/text";
import { useAuthStore } from "@/src/store/useAuthStore";
import { Redirect } from "expo-router";
import React from "react";
import { View } from "react-native";

/**
 * Entry Point Screen
 * Uses declarative Redirect to avoid mounting race conditions
 */
export default function IndexScreen(): React.ReactElement {
  const { token, role, _hasHydrated } = useAuthStore();

  // Wait for hydration before making any redirection decisions
  if (!_hasHydrated) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <Text>LexEase initializing...</Text>
      </View>
    );
  }

  // Redirect based on auth state
  if (!token) {
    return <Redirect href="/(auth)/login" />;
  }

  if (role === "child") {
    return <Redirect href="/(child)/(tabs)/library" />;
  }

  if (role === "guardian") {
    return <Redirect href="/(guardian)/(tabs)/dashboard" />;
  }

  // Fallback
  return <Redirect href="/(auth)/login" />;
}
