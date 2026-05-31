import ChildSelector from "@/src/components/guardian/ChildSelector";
import RangeSelector from "@/src/components/guardian/RangeSelector";
import { useEffectiveTheme } from "@/src/hooks/useEffectiveTheme";
import { Tabs } from "expo-router";
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
  const { theme } = useEffectiveTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: theme.background,
          borderBottomWidth: 1,
          borderBottomColor: theme.border,
          height: 64, // Slightly taller to accommodate selector items comfortably
        },
        headerTitle: "",
        headerLeft: () => (
          <View style={{ paddingLeft: 16 }}>
            <ChildSelector />
          </View>
        ),
        headerRight: () => (
          <View style={{ paddingRight: 16 }}>
            <RangeSelector />
          </View>
        ),
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
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          tabBarIcon: ({ color, size }) => (
            <LayoutDashboard color={color} size={size} />
          ),
          tabBarLabel: "Tổng Quan",
        }}
      />
      <Tabs.Screen
        name="report"
        options={{
          tabBarIcon: ({ color, size }) => (
            <BarChart3 color={color} size={size} />
          ),
          tabBarLabel: "Báo Cáo",
        }}
      />
      <Tabs.Screen
        name="scheduler"
        options={{
          tabBarIcon: ({ color, size }) => (
            <CalendarClock color={color} size={size} />
          ),
          tabBarLabel: "Lịch Học",
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Settings color={color} size={size} />
          ),
          tabBarLabel: "Cài Đặt",
        }}
      />
    </Tabs>
  );
}
