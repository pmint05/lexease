// Tamagui removed: config no longer needed
import { PortalHost } from "@rn-primitives/portal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { Appearance, Platform, useColorScheme, View } from "react-native";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Toaster } from "sonner-native";
// TamaguiProvider removed; using Reusables + Tailwind
import { useThemeStore } from "@/src/store/useThemeStore";
import { useMeQuery } from "../src/hooks/useAuthQueries";
import { useAuthStore } from "../src/store/useAuthStore";
import "./global.css";

// Initialize providers outside component to persist across navigation
const queryClient = new QueryClient();

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

/**
 * Separated component to use hooks that depend on context (if any)
 * and to keep RootLayout clean.
 */
function RootLayoutContent() {
  useMeQuery();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "none",
      }}
    >
      <Stack.Screen name="index" options={{}} />
      <Stack.Screen
        name="(auth)"
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="(child)"
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="(guardian)"
        options={{
          gestureEnabled: false,
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const _hasHydrated = useAuthStore((s) => s._hasHydrated);
  const preferredTheme = useThemeStore((s) => s.theme);

  // Determine effective color scheme: user preference overrides system
  const systemPreference =
    Platform.OS === "web" &&
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : colorScheme;

  const effectiveColorScheme =
    preferredTheme === "system" ? systemPreference : preferredTheme;

  useEffect(() => {
    if (typeof Appearance.setColorScheme === "function") {
      Appearance.setColorScheme(effectiveColorScheme);
    }

    if (Platform.OS === "web") {
      const root = document.documentElement;
      if (effectiveColorScheme === "dark") root.classList.add("dark");
      else root.classList.remove("dark");
    }
  }, [effectiveColorScheme]);

  const [loaded, error] = useFonts({
    "Lexend-Regular": require("@/src/assets/fonts/Lexend-Regular.ttf"),
    "Lexend-Bold": require("@/src/assets/fonts/Lexend-Bold.ttf"),
    "Lexend-SemiBold": require("@/src/assets/fonts/Lexend-SemiBold.ttf"),
    "Lexend-Medium": require("@/src/assets/fonts/Lexend-Medium.ttf"),
    "Lexend-Light": require("@/src/assets/fonts/Lexend-Light.ttf"),
    "Lexend-Thin": require("@/src/assets/fonts/Lexend-Thin.ttf"),
    "Lexend-ExtraBold": require("@/src/assets/fonts/Lexend-ExtraBold.ttf"),
    "Lexend-ExtraLight": require("@/src/assets/fonts/Lexend-ExtraLight.ttf"),
    "Lexend-Black": require("@/src/assets/fonts/Lexend-Black.ttf"),
    "OpenDyslexic-Regular": require("@/src/assets/fonts/OpenDyslexic-Regular.otf"),
    "OpenDyslexic-Bold": require("@/src/assets/fonts/OpenDyslexic-Bold.otf"),
    "OpenDyslexic-Italic": require("@/src/assets/fonts/OpenDyslexic-Italic.otf"),
    "OpenDyslexic-BoldItalic": require("@/src/assets/fonts/OpenDyslexic-BoldItalic.otf"),
  });

  useEffect(() => {
    // Only hide splash screen when fonts and auth hydration are complete.
    if ((loaded || error) && _hasHydrated) {
      if (error) {
        console.warn("Error loading fonts:", error);
      }
      SplashScreen.hideAsync();
    }
  }, [loaded, error, _hasHydrated]);

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <View className={"flex-1 bg-background"} style={{ flex: 1 }}>
          <RootLayoutContent />
          <PortalHost />
          <Toaster />
        </View>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
