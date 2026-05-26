import { useAuthStore } from "@/src/store/useAuthStore";
import { Tabs, useRouter } from "expo-router";
import {
  BarChart3,
  CalendarClock,
  LayoutDashboard,
  LogOut,
  Settings,
} from "lucide-react-native";
import React from "react";
import { Button, Text, useTheme, XStack } from "tamagui";

/**
 * Guardian Tabs Layout
 * Manages dashboard, reports, scheduler, and settings tabs
 */
export default function GuardianTabsLayout(): React.ReactElement {
  const theme = useTheme();
  const { logout } = useAuthStore();
  const router = useRouter();

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
          backgroundColor: theme.background?.val || "#FFFBF7",
          borderBottomWidth: 1,
          borderBottomColor: theme.border?.val || "#EFEAE6",
        },
        headerTitleStyle: {
          fontFamily: "Lexend-Bold",
          fontSize: 18,
          color: theme.foreground?.val || "#221F1E",
        },
        headerLeft: () => (
          <XStack paddingLeft="$4">
            <Text
              fontFamily="Lexend-Black"
              fontSize={20}
              color="$primary"
              letterSpacing={-1}
            >
              LexEase
            </Text>
          </XStack>
        ),
        headerTitleAlign: "center",
        headerShadowVisible: false,
        tabBarStyle: {
          backgroundColor: theme.background?.val || "#FFFBF7",
          borderTopWidth: 1,
          borderTopColor: theme.border?.val || "#EFEAE6",
          height: 72,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarItemStyle: {
          paddingVertical: 8,
        },
        tabBarActiveTintColor: theme.primary?.val || "#0066CC",
        tabBarInactiveTintColor: theme.mutedForeground?.val || "#5A5A5A",
        tabBarLabelStyle: {
          fontFamily: "Lexend-Medium",
          fontSize: 11,
        },
        headerRight: () => (
          <Button
            size="$3"
            chromeless
            icon={
              <LogOut color={theme.destructive?.val || "#E53935"} size={20} />
            }
            onPress={handleLogout}
            marginRight="$2"
            accessibilityLabel="Đăng xuất"
          />
        ),
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
