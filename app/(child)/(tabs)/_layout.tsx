import { Button } from "@/src/components/ui/button";
import { Text } from "@/src/components/ui/text";
import { COLORS } from "@/src/core/constants/colors";
import { THEME } from "@/src/lib/theme";
import { useThemeStore } from "@/src/store/useThemeStore";
import { Tabs, useRouter } from "expo-router";
import { BookOpen, Clock, Search, User as UserIcon } from "lucide-react-native";
import React from "react";
import { Platform, useColorScheme, View } from "react-native";

/**
 * Child Tabs Layout
 * Manages library, history, and profile tabs with a modern bottom navigation
 */
export default function ChildTabsLayout(): React.ReactElement {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const preferredTheme = useThemeStore((s) => s.theme);

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
  const theme = effectiveColorScheme === "dark" ? THEME.dark : THEME.light;

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: theme.card,
          borderBottomWidth: 1,
          borderBottomColor: theme.border,
        },
        headerTitleStyle: {
          fontSize: 18,
          color: theme.foreground,
        },
        headerTitleAlign: "center",
        headerShadowVisible: false,
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopWidth: 1,
          borderTopColor: theme.border,
          height: 70,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarItemStyle: {
          paddingVertical: 8,
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.mutedForeground,
        tabBarLabelStyle: {
          fontFamily: "Lexend-Medium",
          fontSize: 12,
        },
        headerLeft: () => (
          <View style={{ paddingLeft: 16 }}>
            <Text className="text-primary font-bold text-lg">LexEase</Text>
          </View>
        ),
      }}
    >
      <Tabs.Screen
        name="library"
        options={{
          title: "Thư Viện",
          tabBarIcon: ({ color, size }) => (
            <BookOpen color={color} size={size} />
          ),
          headerRight: () => (
            <View style={{ marginRight: 8 }}>
              <Button
                onPress={() => router.push("/(child)/search")}
                size="icon"
                variant="ghost"
                accessibilityLabel="Tìm kiếm"
              >
                <Search color={COLORS.primary} className="size-6" />
              </Button>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "Lịch Sử",
          tabBarIcon: ({ color, size }) => <Clock color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Tài Khoản",
          tabBarIcon: ({ color, size }) => (
            <UserIcon color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
