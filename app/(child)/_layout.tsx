import LoadingScreen from "@/src/components/feedback/loading-screen";
import { useAuthStore } from "@/src/store/useAuthStore";
import { Redirect, Tabs } from "expo-router";
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
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#4CAF50",
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
          title: "Library",
          tabBarLabel: "Library",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="reading/[id]"
        options={{
          title: "Reading",
          href: null,
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
