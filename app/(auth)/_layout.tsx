import { Stack } from "expo-router";
import React from "react";

/**
 * Auth Route Group Layout
 * Defines navigation structure for authentication flows
 */
export default function AuthLayout(): React.ReactElement {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}
    >
      <Stack.Screen
        name="login"
        options={{
          title: "Login",
        }}
      />
      <Stack.Screen
        name="role-selection"
        options={{
          title: "Select Role",
        }}
      />
    </Stack>
  );
}
