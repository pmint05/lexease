import { Button } from "@/src/components/shared/Button";
import { FormField } from "@/src/components/shared/FormField";
import { Card } from "@/src/components/ui/card";
import { Text } from "@/src/components/ui/text";
import { RegisterInput, RegisterSchema } from "@/src/core/schemas/auth";
import { useRegisterMutation } from "@/src/hooks/useAuthQueries";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { Baby, ShieldCheck } from "lucide-react-native";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";

/**
 * Register Screen
 * Redesigned with role selection and dyslexia-friendly layout
 */
export default function RegisterScreen() {
  const router = useRouter();
  const {
    mutate: register,
    isPending,
    data: registerResult,
  } = useRegisterMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: undefined,
    },
  });

  const onRegister = (data: RegisterInput) => {
    register(data);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "$background" }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        bounces={false}
        className="bg-background"
      >
        <View className="flex-1 justify-between">
          {/* Top Section */}
          <View className="flex-1 items-center justify-center px-6">
            <Text variant="h1" className="text-primary text-center">
              Tạo tài khoản mới
            </Text>
            <Text className="mt-2 text-center text-lg text-muted-foreground">
              Khởi đầu hành trình đọc sách cùng LexEase
            </Text>
          </View>

          {/* Form Card */}
          <Card className="rounded-t-3xl rounded-b-none border-b-0 px-6 py-6">
            <View className="gap-5">
              <View className="gap-4">
                <FormField
                  label="Họ và tên"
                  name="name"
                  control={control}
                  placeholder="Nguyễn Văn A"
                  error={errors.name?.message}
                />

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

                <FormField
                  label="Xác nhận mật khẩu"
                  name="confirmPassword"
                  control={control}
                  placeholder="••••••••"
                  secureTextEntry
                  error={errors.confirmPassword?.message}
                />

                {/* Role Selection */}
                <View className="gap-2">
                  <Text className="text-sm font-bold text-foreground ml-1">
                    Bạn là ai?
                  </Text>
                  <Controller
                    control={control}
                    name="role"
                    render={({ field: { onChange, value } }) => (
                      <View className="flex-row gap-3">
                        <RoleButton
                          icon={
                            <Baby
                              size={32}
                              color={value === "child" ? "#2196F3" : "#9E9E9E"}
                            />
                          }
                          label="Bé"
                          isSelected={value === "child"}
                          onPress={() => onChange("child")}
                        />
                        <RoleButton
                          icon={
                            <ShieldCheck
                              size={32}
                              color={
                                value === "guardian" ? "#2196F3" : "#9E9E9E"
                              }
                            />
                          }
                          label="Phụ huynh"
                          isSelected={value === "guardian"}
                          onPress={() => onChange("guardian")}
                        />
                      </View>
                    )}
                  />
                  {errors.role ? (
                    <Text className="text-sm text-destructive ml-1">
                      {errors.role.message}
                    </Text>
                  ) : null}
                </View>

                <Button
                  onPress={handleSubmit(onRegister)}
                  disabled={isPending}
                  size="large"
                  className="mt-2"
                >
                  {isPending ? "Đang đăng ký..." : "Đăng ký"}
                </Button>
                {registerResult?.success === false && registerResult.error ? (
                  <Text className="text-center text-sm text-destructive">
                    {registerResult.error}
                  </Text>
                ) : null}
              </View>

              <Text className="mt-2 text-center text-sm text-muted-foreground">
                Đã có tài khoản?{" "}
                <Text
                  className="font-bold text-primary"
                  onPress={() => router.push("/(auth)/login")}
                >
                  Đăng nhập
                </Text>
              </Text>
            </View>
          </Card>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

interface RoleButtonProps {
  icon: React.ReactNode;
  label: string;
  isSelected: boolean;
  onPress: () => void;
}

const RoleButton = ({ icon, label, isSelected, onPress }: RoleButtonProps) => (
  <Pressable onPress={onPress} style={{ flex: 1 }}>
    <View
      className={`p-4 border-2 rounded-lg items-center gap-2 ${
        isSelected
          ? "border-transparent bg-primary/10"
          : "border-transparent bg-muted"
      }`}
    >
      {icon}
      <Text
        className={`font-bold ${isSelected ? "text-primary" : "text-foreground"}`}
      >
        {label}
      </Text>
    </View>
  </Pressable>
);
