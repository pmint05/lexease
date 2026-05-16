import { useAuthStore } from "@/src/store/useAuthStore";
import { Tabs, useRouter } from "expo-router";
import { BookOpen, Clock, LogOut } from "lucide-react-native";
import React from "react";
import { Button, useTheme } from "tamagui";

/**
 * Child Tabs Layout
 * Manages library and history tabs with a modern bottom navigation
 */
export default function ChildTabsLayout(): React.ReactElement {
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
        headerTitleAlign: "center",
        headerShadowVisible: false,
        tabBarTranslucent: false, // Ngăn việc nội dung bị tràn xuống dưới thanh điều hướng
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
          fontSize: 12,
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
        name="library"
        options={{
          title: "Thư Viện",
          tabBarIcon: ({ color, size }) => (
            <BookOpen color={color} size={size} />
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
    </Tabs>
  );
}
