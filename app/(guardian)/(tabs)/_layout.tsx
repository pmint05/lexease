import { Stack } from "expo-router";
import React from "react";

/**
 * Guardian Tabs Layout
 * Manages dashboard, config, and scheduler tabs
 */
export default function GuardianTabsLayout(): React.ReactElement {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
        }}
      />
      <Stack.Screen
        name="config"
        options={{
          title: "Customizer",
        }}
      />
      <Stack.Screen
        name="scheduler"
        options={{
          title: "Scheduler",
        }}
      />
    </Stack>
  );
}
