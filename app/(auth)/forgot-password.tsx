import { Button } from "@/src/components/shared/Button";
import { FormField } from "@/src/components/shared/FormField";
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
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Card, H1, Text, XStack, YStack } from "tamagui";

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
      <YStack
        flex={1}
        justifyContent="center"
        alignItems="center"
        padding="$6"
        backgroundColor="$background"
        gap="$4"
      >
        <MailCheck size={64} color="#4CAF50" />
        <H1 textAlign="center" fontFamily="$lexend">
          Kiểm tra email
        </H1>
        <Text textAlign="center" color="$color10" fontFamily="$lexend">
          Chúng tôi đã gửi link khôi phục mật khẩu đến email của bạn.
        </Text>
        <Button
          onPress={() => router.replace("/(auth)/login")}
          marginTop="$4"
          width="100%"
        >
          Quay lại đăng nhập
        </Button>
      </YStack>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} bounces={false}>
        <YStack flex={1}>
          {/* Header */}
          <XStack paddingHorizontal="$4" paddingTop="$6" alignItems="center">
            <Button
              uiVariant="ghost"
              circular
              onPress={() => router.back()}
              icon={<ChevronLeft size={24} />}
            />
          </XStack>

          <YStack flex={1} justifyContent="space-between">
            <YStack padding="$6">
              <H1 fontSize="$10" fontWeight="bold" fontFamily="$lexend">
                Quên mật khẩu?
              </H1>
              <Text color="$color10" fontFamily="$lexend" marginTop="$1">
                Nhập email của bạn để nhận hướng dẫn khôi phục mật khẩu.
              </Text>
            </YStack>

            {/* Form Card */}
            <Card
              padding="$6"
              borderTopLeftRadius="$9"
              borderTopRightRadius="$9"
              borderBottomLeftRadius={0}
              borderBottomRightRadius={0}
              backgroundColor="$background"
            >
              <YStack gap="$6">
                <FormField
                  label="Email khôi phục"
                  name="email"
                  control={control}
                  placeholder="name@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={errors.email?.message}
                  fontFamily="$lexend"
                />

                <Button
                  onPress={handleSubmit(onSubmit)}
                  disabled={isPending}
                  size="large"
                  marginTop="$2"
                >
                  {isPending ? "Đang gửi..." : "Gửi yêu cầu"}
                </Button>

                <XStack justifyContent="center" paddingBottom="$10">
                  <Text
                    color="$color10"
                    fontFamily="$lexend"
                    onPress={() => router.push("/(auth)/login")}
                  >
                    Quay lại đăng nhập
                  </Text>
                </XStack>
              </YStack>
            </Card>
          </YStack>
        </YStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
