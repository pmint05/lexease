import { useAuthStore } from "@/src/store/useAuthStore";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Button, Form, Input, Text, XStack, YStack } from "tamagui";

/**
 * Login Screen
 * Email/password authentication
 * Routes directly to the user's fixed role area on success
 */
export default function LoginScreen(): React.ReactElement {
  const router = useRouter();
  const { login } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      const result = login({ email, password });

      if (!result.success || !result.user) {
        setError(result.error ?? "Đăng nhập thất bại");
        return;
      }

      if (result.user.role === "child") {
        router.replace("/(child)/(tabs)/library");
      } else {
        router.replace("/(guardian)/(tabs)/dashboard");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <YStack
      flex={1}
      justifyContent="center"
      alignItems="center"
      padding="$4"
      backgroundColor="$background"
      gap="$4"
    >
      <Text
        fontSize="$8"
        fontWeight="bold"
        accessibilityRole="header"
        accessibilityLabel="LexEase login"
      >
        LexEase
      </Text>

      <Form gap="$3" width="100%" maxWidth={300}>
        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          size="$4"
          accessible
          accessibilityLabel="Email input"
          accessibilityRole="text"
        />

        <Input
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          size="$4"
          accessible
          accessibilityLabel="Password input"
          accessibilityRole="text"
        />

        {error ? (
          <Text color="$red10" fontSize="$2">
            {error}
          </Text>
        ) : null}

        <Button
          onPress={handleLogin}
          disabled={loading}
          size="$5"
          accessible
          accessibilityRole="button"
          accessibilityLabel="Login button"
        >
          {loading ? "Logging in..." : "Login"}
        </Button>

        <XStack justifyContent="center">
          <Text
            onPress={() => router.push("/(auth)/register")}
            accessibilityRole="button"
            accessibilityLabel="Go to registration"
          >
            Chưa có tài khoản? Đăng ký
          </Text>
        </XStack>
      </Form>
    </YStack>
  );
}
