import { useAuthStore } from "@/src/store/useAuthStore";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable } from "react-native";
import { Button, Form, Input, Text, XStack, YStack } from "tamagui";

export default function RegisterScreen(): React.ReactElement {
  const router = useRouter();
  const { register } = useAuthStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"child" | "guardian" | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async (): Promise<void> => {
    if (!name || !email || !password) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Email không hợp lệ. Vui lòng nhập email đúng định dạng");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    if (!role) {
      setError("Vui lòng chọn vai trò cho tài khoản");
      return;
    }

    setLoading(true);
    try {
      const result = register({
        name,
        email,
        password,
        role,
      });

      if (!result.success || !result.user) {
        setError(result.error ?? "Đăng ký thất bại");
        return;
      }

      if (result.user.role === "child") {
        router.replace("/(child)/(tabs)/library");
      } else {
        router.replace("/(guardian)/(tabs)/dashboard");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <YStack flex={1} justifyContent="center" alignItems="center" padding="$4" backgroundColor="$background" gap="$4">
      <Text fontSize="$8" fontWeight="bold" accessibilityRole="header">
        Tạo tài khoản
      </Text>

      <Form gap="$3" width="100%" maxWidth={340}>
        <Input placeholder="Họ và tên" value={name} onChangeText={setName} size="$4" accessibilityLabel="Họ và tên" />
        <YStack>
          <Input
            placeholder="Email (vd: user@example.com)"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            size="$4"
            accessibilityLabel="Email đăng ký"
            borderColor={email && !isValidEmail(email) ? "$red10" : "$color5"}
            borderWidth={1}
          />
          {email && !isValidEmail(email) && (
            <Text color="$red10" fontSize="$2" marginTop="$1">
              Email không đúng định dạng
            </Text>
          )}
        </YStack>
        <Input placeholder="Mật khẩu" value={password} onChangeText={setPassword} secureTextEntry size="$4" accessibilityLabel="Mật khẩu" />
        <Input placeholder="Nhập lại mật khẩu" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry size="$4" accessibilityLabel="Xác nhận mật khẩu" />

        <YStack gap="$2">
          <Text fontWeight="700">Chọn vai trò tài khoản</Text>
          <XStack gap="$2">
            <Pressable onPress={() => setRole("child")} accessibilityRole="button" accessibilityLabel="Chọn vai trò bé">
              <YStack
                padding="$3"
                borderWidth={2}
                borderRadius="$4"
                borderColor={role === "child" ? "$green10" : "$color6"}
                backgroundColor={role === "child" ? "$green2" : "$background"}
              >
                <Text fontWeight="700">Child</Text>
              </YStack>
            </Pressable>
            <Pressable onPress={() => setRole("guardian")} accessibilityRole="button" accessibilityLabel="Chọn vai trò phụ huynh">
              <YStack
                padding="$3"
                borderWidth={2}
                borderRadius="$4"
                borderColor={role === "guardian" ? "$blue10" : "$color6"}
                backgroundColor={role === "guardian" ? "$blue2" : "$background"}
              >
                <Text fontWeight="700">Guardian</Text>
              </YStack>
            </Pressable>
          </XStack>
        </YStack>

        {error ? <Text color="$red10">{error}</Text> : null}

        <Button onPress={handleRegister} disabled={loading} size="$5" accessibilityRole="button" accessibilityLabel="Đăng ký tài khoản">
          {loading ? "Đang tạo tài khoản..." : "Đăng ký"}
        </Button>

        <XStack justifyContent="center">
          <Text onPress={() => router.push("/(auth)/login")} accessibilityRole="button" accessibilityLabel="Đã có tài khoản, quay lại đăng nhập">
            Đã có tài khoản? Đăng nhập
          </Text>
        </XStack>
      </Form>
    </YStack>
  );
}