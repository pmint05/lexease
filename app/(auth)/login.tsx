// import { Button } from "@/src/components/shared/Button";
import { Button } from "@/src/components/shared/Button";
import { FormField } from "@/src/components/shared/FormField";
import { LoginInput, LoginSchema } from "@/src/core/schemas/auth";
import { useLoginMutation } from "@/src/hooks/useAuthQueries";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Card, H1, Text, XStack, YStack } from "tamagui";

/**
 * Login Screen
 * Redesigned for mobile-first, dyslexia-friendly, and push-to-bottom layout
 */
export default function LoginScreen() {
  const router = useRouter();
  const { mutate: login, isPending } = useLoginMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onLogin = (data: LoginInput) => {
    login(data, {
      onSuccess: (result) => {
        if (!result.success) {
          // Handle logic error if needed, but useMutation already handles state
        }
      },
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} bounces={false}>
        <YStack flex={1} justifyContent="space-between">
          {/* Top Section: Branding / Illustration */}
          <YStack
            flex={1}
            justifyContent="center"
            alignItems="center"
            padding="$6"
          >
            <H1
              fontSize="$12"
              fontWeight="bold"
              color="$primary"
              fontFamily="$lexend"
              textAlign="center"
            >
              LexEase
            </H1>
            <Text
              fontSize="$5"
              color="$color10"
              textAlign="center"
              marginTop="$2"
              fontFamily="$lexend"
            >
              Hỗ trợ bé đọc sách mỗi ngày
            </Text>
          </YStack>

          {/* Bottom Section: Form Card */}
          <Card
            padding="$6"
            borderTopLeftRadius="$12"
            borderTopRightRadius="$12"
            borderBottomLeftRadius={0}
            borderBottomRightRadius={0}
            backgroundColor="$surface"
            elevation="$2"
          >
            <YStack gap="$5">
              <YStack gap="$1">
                <Text fontSize="$8" fontWeight="bold" fontFamily="$lexend">
                  Đăng nhập
                </Text>
                <Text color="$color10" fontFamily="$lexend">
                  Chào mừng bạn quay trở lại
                </Text>
              </YStack>

              <YStack gap="$4">
                <FormField
                  label="Email"
                  name="email"
                  control={control}
                  placeholder="name@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={errors.email?.message}
                  fontFamily="$lexend"
                />

                <FormField
                  label="Mật khẩu"
                  name="password"
                  control={control}
                  placeholder="••••••••"
                  secureTextEntry
                  error={errors.password?.message}
                  fontFamily="$lexend"
                />

                <XStack justifyContent="flex-end">
                  <Text
                    fontSize="$3"
                    color="$primary"
                    fontWeight="bold"
                    fontFamily="$lexend"
                    onPress={() => router.push("/(auth)/forgot-password")}
                  >
                    Quên mật khẩu?
                  </Text>
                </XStack>

                <Button
                  onPress={handleSubmit(onLogin)}
                  disabled={isPending}
                  size="large"
                  marginTop="$2"
                >
                  {isPending ? "Đang xử lý..." : "Đăng nhập"}
                </Button>
              </YStack>

              <Text
                textAlign="center"
                color="$color10"
                fontFamily="$lexend"
                marginTop="$2"
              >
                Chưa có tài khoản?{" "}
                <Text
                  color="$primary"
                  fontWeight="bold"
                  onPress={() => router.push("/(auth)/register")}
                >
                  Đăng ký ngay
                </Text>
              </Text>
            </YStack>
          </Card>
        </YStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
