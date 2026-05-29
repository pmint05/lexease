import { COLORS } from "@/src/core/constants/colors";
import { Tabs, useRouter } from "expo-router";
import { BookOpen, Clock, Search, User as UserIcon } from "lucide-react-native";
import React from "react";
import { Button, Text, XStack } from "tamagui";

/**
 * Child Tabs Layout
 * Manages library, history, and profile tabs with a modern bottom navigation
 */
export default function ChildTabsLayout(): React.ReactElement {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: COLORS.cream,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.border,
        },
        headerTitleStyle: {
          fontFamily: "Lexend-Bold",
          fontSize: 18,
          color: COLORS.textDark,
        },
        headerTitleAlign: "center",
        headerShadowVisible: false,
        tabBarStyle: {
          backgroundColor: COLORS.cream,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          height: 70,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarItemStyle: {
          paddingVertical: 8,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.muted,
        tabBarLabelStyle: {
          fontFamily: "Lexend-Medium",
          fontSize: 12,
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
            <XStack marginRight="$2">
              <Button
                size="$3"
                chromeless
                icon={
                  <Search color={COLORS.primary} size={22} />
                }
                onPress={() => router.push("/(child)/search")}
                accessibilityLabel="Tìm kiếm"
              />
            </XStack>
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
