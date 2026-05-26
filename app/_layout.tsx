import tamaguiConfig from "@/src/core/constants/tamagui.config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { Platform, useColorScheme, View } from "react-native";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PortalProvider, TamaguiProvider } from "tamagui";
import { useAuthStore } from "../src/store/useAuthStore";
import "./globall.css";

// Initialize providers outside component to persist across navigation
const queryClient = new QueryClient();

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

/**
 * Separated component to use hooks that depend on context (if any)
 * and to keep RootLayout clean.
 */
function RootLayoutContent() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
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

  // On web, fallback to matchMedia if useColorScheme is unreliable
  const effectiveColorScheme =
    Platform.OS === "web" &&
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : colorScheme;

  useEffect(() => {
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
      <TamaguiProvider
        config={tamaguiConfig}
        defaultTheme={"light"}
        // defaultTheme={effectiveColorScheme === "dark" ? "dark" : "light"}
      >
        <QueryClientProvider client={queryClient}>
          <PortalProvider>
            <View
              className={
                "flex-1"
                // effectiveColorScheme === "dark" ? "dark flex-1" : "flex-1"
              }
              style={{ flex: 1 }}
            >
              <RootLayoutContent />
            </View>
          </PortalProvider>
        </QueryClientProvider>
      </TamaguiProvider>
    </SafeAreaProvider>
  );
}
