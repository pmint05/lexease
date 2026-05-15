import LoadingScreen from "@/src/components/feedback/loading-screen";
import { useAuthStore } from "@/src/store/useAuthStore";
import { Redirect, Tabs } from "expo-router";
import React from "react";

/**
 * Guardian Route Group Layout
 * Protects guardian routes from unauthorized access
 */
export default function GuardianLayout(): React.ReactElement {
  const { token, role, _hasHydrated } = useAuthStore();

  if (!_hasHydrated) return <LoadingScreen />;

  // Protect route
  if (!token || role !== "guardian") {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#2196F3",
        tabBarInactiveTintColor: "#9E9E9E",
        tabBarStyle: {
          backgroundColor: "#FFF8F0",
          borderTopColor: "#E0E0E0",
          minHeight: 60,
        },
      }}
    >
      <Tabs.Screen
        name="(tabs)"
        options={{
          title: "Dashboard",
          tabBarLabel: "Dashboard",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="book/[id]"
        options={{
          title: "Book Details",
          href: null,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
