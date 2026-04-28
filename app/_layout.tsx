import { config } from "@tamagui/config/v3";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React from "react";
import "react-native-reanimated";
import { TamaguiProvider, createTamagui } from "tamagui";
import "./globall.css";

// Initialize providers outside component to persist across navigation
const queryClient = new QueryClient();

// Create Tamagui instance with proper configuration
const tamaguiConfig = createTamagui(config as any);

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    async function prepare() {
      try {
        // Load fonts (TODO: Replace with actual font files in Phase 2)
        // Fonts should be placed in src/assets/fonts/ directory
        // await Font.loadAsync({
        //   OpenDyslexic: require("@/src/assets/fonts/OpenDyslexic.ttf"),
        //   Lexend: require("@/src/assets/fonts/Lexend.ttf"),
        // });
      } catch (e) {
        console.warn("Error loading fonts:", e);
      } finally {
        setIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <TamaguiProvider config={tamaguiConfig as any} defaultTheme="light">
      <QueryClientProvider client={queryClient}>
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
      </QueryClientProvider>
    </TamaguiProvider>
  );
}
