import { Tabs } from "expo-router";
import React from "react";

/**
 * Guardian Route Group Layout
 * Bottom-tabs navigation for guardian user:
 * - Dashboard: Analytics and progress insights
 * - Config: Visual customizer for child's reading experience
 * - Scheduler: Practice schedule and reminders
 */
export default function GuardianLayout(): React.ReactElement {
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
    </Tabs>
  );
}
