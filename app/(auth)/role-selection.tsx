import { useAuthStore } from "@/src/store/useAuthStore";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable } from "react-native";
import { Button, Card, Text, XStack, YStack } from "tamagui";

/**
 * Role Selection Screen
 * Allows user to select between Child and Guardian roles
 */
export default function RoleSelectionScreen(): React.ReactElement {
  const router = useRouter();
  const { setRole } = useAuthStore();
  const [selectedRole, setSelectedRole] = useState<"child" | "guardian" | null>(
    null,
  );

  const handleContinue = () => {
    if (!selectedRole) {
      return;
    }

    setRole(selectedRole);

    if (selectedRole === "child") {
      router.replace("/(child)/(tabs)/library");
    } else {
      router.replace("/(guardian)/(tabs)/dashboard");
    }
  };

  return (
    <YStack
      flex={1}
      justifyContent="center"
      alignItems="center"
      padding="$4"
      backgroundColor="$background"
      gap="$6"
    >
      <Text
        fontSize="$7"
        fontWeight="bold"
        accessibilityRole="header"
        accessibilityLabel="Select your role"
      >
        Select Your Role
      </Text>

      <XStack gap="$4" justifyContent="center" flexWrap="wrap">
        {/* Child Role Card */}
        <Pressable
          onPress={() => setSelectedRole("child")}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Select child role"
          accessibilityHint="Tap to select child reader role"
          accessibilityState={{ selected: selectedRole === "child" }}
        >
          <Card
            padding="$4"
            width={120}
            height={120}
            justifyContent="center"
            alignItems="center"
            borderColor={selectedRole === "child" ? "$green" : "$gray"}
            borderWidth={selectedRole === "child" ? 3 : 1}
            backgroundColor={
              selectedRole === "child" ? "$green2" : "$background"
            }
          >
            <Text fontSize="$6">👶</Text>
            <Text fontSize="$3" fontWeight="bold" marginTop="$2">
              Child
            </Text>
          </Card>
        </Pressable>

        {/* Guardian Role Card */}
        <Pressable
          onPress={() => setSelectedRole("guardian")}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Select guardian role"
          accessibilityHint="Tap to select guardian role"
          accessibilityState={{ selected: selectedRole === "guardian" }}
        >
          <Card
            padding="$4"
            width={120}
            height={120}
            justifyContent="center"
            alignItems="center"
            borderColor={selectedRole === "guardian" ? "$blue" : "$gray"}
            borderWidth={selectedRole === "guardian" ? 3 : 1}
            backgroundColor={
              selectedRole === "guardian" ? "$blue2" : "$background"
            }
          >
            <Text fontSize="$6">👨</Text>
            <Text fontSize="$3" fontWeight="bold" marginTop="$2">
              Guardian
            </Text>
          </Card>
        </Pressable>
      </XStack>

      <Button
        onPress={handleContinue}
        disabled={!selectedRole}
        size="$5"
        width={200}
        accessible
        accessibilityRole="button"
        accessibilityLabel="Continue button"
      >
        Continue
      </Button>
    </YStack>
  );
}
