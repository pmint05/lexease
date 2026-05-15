import tamaguiConfig from "@/src/core/constants/tamagui.config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { Platform, useColorScheme, View } from "react-native";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { TamaguiProvider } from "tamagui";
import "./globall.css";
import { useAuthStore } from "../src/store/useAuthStore";

// Initialize providers outside component to persist across navigation
const queryClient = new QueryClient();

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

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
    // ONLY hide splash screen when fonts AND hydration are both complete
    if ((loaded || error) && _hasHydrated) {
      if (error) {
        console.warn("Error loading fonts:", error);
      }
      SplashScreen.hideAsync();
    }
  }, [loaded, error, _hasHydrated]);

  // MANDATORY: RootLayout MUST always return a navigator if possible, 
  // or at least a structure that leads to one immediately.
  // We avoid returning null even during font loading because 
  // SplashScreen handles the visual wait.
  
  return (
    <SafeAreaProvider>
      <TamaguiProvider
        config={tamaguiConfig}
        defaultTheme={effectiveColorScheme === "dark" ? "dark" : "light"}
      >
        <QueryClientProvider client={queryClient}>
          <View
            className={
              effectiveColorScheme === "dark" ? "dark flex-1" : "flex-1"
            }
            style={{ flex: 1 }}
          >
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
          </View>
        </QueryClientProvider>
      </TamaguiProvider>
    </SafeAreaProvider>
  );
}
