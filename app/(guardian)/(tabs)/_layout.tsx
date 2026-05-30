import { Text } from "@/src/components/ui/text";
// COLORS import removed (logout moved to Settings)
import { useEffectiveTheme } from "@/src/hooks/useEffectiveTheme";
import { useAuthStore } from "@/src/store/useAuthStore";
import { Tabs, useRouter } from "expo-router";
import {
  BarChart3,
  CalendarClock,
  LayoutDashboard,
  Settings,
} from "lucide-react-native";
import React from "react";
import { View } from "react-native";

/**
 * Guardian Tabs Layout
 * Manages dashboard, reports, scheduler, and settings tabs
 */
export default function GuardianTabsLayout(): React.ReactElement {
  const { logout } = useAuthStore();
  const router = useRouter();
  const { theme } = useEffectiveTheme();

  const handleLogout = async () => {
    logout();
    await new Promise((resolve) => setTimeout(resolve, 100));
    router.replace("/(auth)/login");
  };

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
        headerLeft: () => (
          <View style={{ paddingLeft: 16 }}>
            <Text
              className="text-primary"
              style={{ fontSize: 20, letterSpacing: -1 }}
            >
              LexEase
            </Text>
          </View>
        ),
        headerTitleAlign: "center",
        headerShadowVisible: false,
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopWidth: 1,
          borderTopColor: theme.border,
          height: 72,
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
          fontSize: 11,
        },
        // headerRight removed: logout moved into Settings screen
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Tổng Quan",
          tabBarIcon: ({ color, size }) => (
            <LayoutDashboard color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="report"
        options={{
          title: "Báo Cáo",
          tabBarIcon: ({ color, size }) => (
            <BarChart3 color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="scheduler"
        options={{
          title: "Lịch Học",
          tabBarIcon: ({ color, size }) => (
            <CalendarClock color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Cài Đặt",
          tabBarIcon: ({ color, size }) => (
            <Settings color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
