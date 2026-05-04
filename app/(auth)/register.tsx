import { useAuthStore } from "@/src/store/useAuthStore";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Button, Form, Input, Text, XStack, YStack } from "tamagui";

export default function RegisterScreen(): React.ReactElement {
  const router = useRouter();
  const { setToken, setUser } = useAuthStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (): Promise<void> => {
    if (!name || !email || !password) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    setLoading(true);
    try {
      setToken(`mock-token-${Date.now()}`);
      setUser({
        id: `user-${Date.now()}`,
        email,
        name,
      });
      router.push("/(auth)/role-selection");
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
        <Input placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" size="$4" accessibilityLabel="Email đăng ký" />
        <Input placeholder="Mật khẩu" value={password} onChangeText={setPassword} secureTextEntry size="$4" accessibilityLabel="Mật khẩu" />
        <Input placeholder="Nhập lại mật khẩu" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry size="$4" accessibilityLabel="Xác nhận mật khẩu" />

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