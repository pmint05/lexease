import { Button } from "@/src/components/shared/Button";
import { FormField } from "@/src/components/shared/FormField";
import { Card } from "@/src/components/ui/card";
import { Text } from "@/src/components/ui/text";
import {
  ForgotPasswordInput,
  ForgotPasswordSchema,
} from "@/src/core/schemas/auth";
import { useForgotPasswordMutation } from "@/src/hooks/useAuthQueries";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { ChevronLeft, MailCheck } from "lucide-react-native";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";

/**
 * Forgot Password Screen
 * Allows users to request password reset link
 */
export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [isSuccess, setIsSuccess] = useState(false);
  const { mutate: forgotPassword, isPending } = useForgotPasswordMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: ForgotPasswordInput) => {
    forgotPassword(data.email, {
      onSuccess: (result) => {
        if (result.success) {
          setIsSuccess(true);
        }
      },
    });
  };

  if (isSuccess) {
    return (
      <View className="flex-1 justify-center items-center p-6 bg-background gap-4">
        <MailCheck size={64} color="#4CAF50" />
        <Text variant="h1" className="text-center">
          Kiểm tra email
        </Text>
        <Text className="text-center text-muted-foreground">
          Chúng tôi đã gửi link khôi phục mật khẩu đến email của bạn.
        </Text>
        <Button
          onPress={() => router.replace("/(auth)/login")}
          className="mt-4 w-full"
        >
          Quay lại đăng nhập
        </Button>
      </View>
    );
  }

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
        <View className="flex-1">
          {/* Header */}
          <View className="px-4 pt-6 items-center">
            <Button
              uiVariant="ghost"
              circular
              onPress={() => router.back()}
              icon={<ChevronLeft size={24} />}
            />
          </View>

          <View className="flex-1 justify-between">
            <View className="p-6">
              <Text className="text-3xl font-bold">Quên mật khẩu?</Text>
              <Text className="text-muted-foreground mt-1">
                Nhập email của bạn để nhận hướng dẫn khôi phục mật khẩu.
              </Text>
            </View>

            {/* Form Card */}
            <Card className="rounded-t-3xl rounded-b-none px-6 py-6 bg-background">
              <View className="gap-6">
                <FormField
                  label="Email khôi phục"
                  name="email"
                  control={control}
                  placeholder="name@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={errors.email?.message}
                />

                <Button
                  onPress={handleSubmit(onSubmit)}
                  disabled={isPending}
                  size="large"
                  className="mt-2"
                >
                  {isPending ? "Đang gửi..." : "Gửi yêu cầu"}
                </Button>

                <View className="flex-row justify-center">
                  <Text
                    className="text-muted-foreground"
                    onPress={() => router.push("/(auth)/login")}
                  >
                    Quay lại đăng nhập
                  </Text>
                </View>
              </View>
            </Card>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
