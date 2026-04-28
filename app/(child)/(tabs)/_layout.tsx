import { Stack } from "expo-router";
import React from "react";

/**
 * Child Tabs Layout
 * Manages library and history tabs
 */
export default function ChildTabsLayout(): React.ReactElement {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="library"
        options={{
          title: "Library",
        }}
      />
      <Stack.Screen
        name="history"
        options={{
          title: "History",
        }}
      />
    </Stack>
  );
}
