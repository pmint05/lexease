import { Tabs } from "expo-router";
import React from "react";

/**
 * Child Route Group Layout
 * Bottom-tabs navigation for child user:
 * - Library: Browse and select books
 * - History: View past recordings and reading history
 * (Full-screen reading route is outside tabs)
 */
export default function ChildLayout(): React.ReactElement {
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
          href: null, // Hidden from tab bar
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
