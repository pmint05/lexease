import { Button } from "@/src/components/shared/Button";
import { FormField } from "@/src/components/shared/FormField";
import { Card } from "@/src/components/ui/card";
import { Text } from "@/src/components/ui/text";
import { LoginInput, LoginSchema } from "@/src/core/schemas/auth";
import { useLoginMutation } from "@/src/hooks/useAuthQueries";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";

/**
 * Login Screen
 * Redesigned for mobile-first, dyslexia-friendly, and push-to-bottom layout
 */
export default function LoginScreen() {
  const router = useRouter();
  const { mutate: login, isPending, data: loginResult } = useLoginMutation();

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
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        bounces={false}
        className="bg-background"
      >
        <View className="flex-1 justify-between">
          <View className="flex-1 items-center justify-center px-6">
            <Text variant="h1" className="text-primary text-center">
              LexEase
            </Text>
            <Text className="mt-2 text-center text-lg text-muted-foreground">
              Hỗ trợ bé đọc sách mỗi ngày
            </Text>
          </View>

          <Card className="rounded-t-3xl rounded-b-none border-b-0 px-6 py-6">
            <View className="gap-5">
              <View className="gap-1">
                <Text className="text-3xl font-bold text-foreground">
                  Đăng nhập
                </Text>
                <Text className="text-muted-foreground">
                  Chào mừng bạn quay trở lại
                </Text>
              </View>

              <View className="gap-4">
                <FormField
                  label="Email"
                  name="email"
                  control={control}
                  placeholder="name@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={errors.email?.message}
                />

                <FormField
                  label="Mật khẩu"
                  name="password"
                  control={control}
                  placeholder="••••••••"
                  secureTextEntry
                  error={errors.password?.message}
                />

                <View className="items-end">
                  <Text
                    className="text-sm font-bold text-primary"
                    onPress={() => router.push("/(auth)/forgot-password")}
                  >
                    Quên mật khẩu?
                  </Text>
                </View>

                <Button
                  onPress={handleSubmit(onLogin)}
                  disabled={isPending}
                  size="large"
                  uiVariant="primary"
                >
                  {isPending ? "Đang xử lý..." : "Đăng nhập"}
                </Button>
                {loginResult?.success === false && loginResult.error ? (
                  <Text className="text-center text-sm text-destructive">
                    {loginResult.error}
                  </Text>
                ) : null}
              </View>

              <Text className="mt-2 text-center text-sm text-muted-foreground">
                Chưa có tài khoản?{" "}
                <Text
                  className="font-bold text-primary"
                  onPress={() => router.push("/(auth)/register")}
                >
                  Đăng ký ngay
                </Text>
              </Text>
            </View>
          </Card>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
