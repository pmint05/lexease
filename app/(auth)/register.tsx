import React from "react";
import { Platform, KeyboardAvoidingView, ScrollView, Pressable } from "react-native";
import { YStack, Text, XStack, H1, Card } from "tamagui";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Baby, ShieldCheck } from "lucide-react-native";
import { RegisterInput, RegisterSchema } from "@/src/core/schemas/auth";
import { FormField } from "@/src/components/shared/FormField";
import { Button } from "@/src/components/shared/Button";
import { useRegisterMutation } from "@/src/hooks/useAuthQueries";

/**
 * Register Screen
 * Redesigned with role selection and dyslexia-friendly layout
 */
export default function RegisterScreen() {
  const router = useRouter();
  const { mutate: register, isPending } = useRegisterMutation();

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
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        backgroundColor="$background"
        bounces={false}
      >
        <YStack flex={1} justifyContent="space-between">
          {/* Top Section */}
          <YStack padding="$6" paddingTop="$10">
            <H1 fontSize="$10" fontWeight="bold" fontFamily="$lexend">
              Tạo tài khoản mới
            </H1>
            <Text color="$color10" fontFamily="$lexend" marginTop="$1">
              Khởi đầu hành trình đọc sách cùng LexEase
            </Text>
          </YStack>

          {/* Form Card */}
          <Card
            bordered
            elevate
            padding="$6"
            borderTopLeftRadius="$9"
            borderTopRightRadius="$9"
            borderBottomLeftRadius={0}
            borderBottomRightRadius={0}
            backgroundColor="$background"
          >
            <YStack gap="$5">
              <YStack gap="$4">
                <FormField
                  label="Họ và tên"
                  name="name"
                  control={control}
                  placeholder="Nguyễn Văn A"
                  error={errors.name?.message}
                  fontFamily="$lexend"
                />

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

                <FormField
                  label="Xác nhận mật khẩu"
                  name="confirmPassword"
                  control={control}
                  placeholder="••••••••"
                  secureTextEntry
                  error={errors.confirmPassword?.message}
                  fontFamily="$lexend"
                />

                {/* Role Selection */}
                <YStack gap="$2">
                  <Text fontSize="$3" fontWeight="bold" color="$color11" marginLeft="$1">
                    Bạn là ai?
                  </Text>
                  <Controller
                    control={control}
                    name="role"
                    render={({ field: { onChange, value } }) => (
                      <XStack gap="$3">
                        <RoleButton
                          icon={<Baby size={32} color={value === "child" ? "#4CAF50" : "#9E9E9E"} />}
                          label="Bé"
                          isSelected={value === "child"}
                          onPress={() => onChange("child")}
                        />
                        <RoleButton
                          icon={<ShieldCheck size={32} color={value === "guardian" ? "#2196F3" : "#9E9E9E"} />}
                          label="Phụ huynh"
                          isSelected={value === "guardian"}
                          onPress={() => onChange("guardian")}
                        />
                      </XStack>
                    )}
                  />
                  {errors.role ? (
                    <Text fontSize="$2" color="$red10" marginLeft="$1">
                      {errors.role.message}
                    </Text>
                  ) : null}
                </YStack>

                <Button
                  onPress={handleSubmit(onRegister)}
                  disabled={isPending}
                  size="large"
                  marginTop="$2"
                >
                  {isPending ? "Đang đăng ký..." : "Đăng ký"}
                </Button>
              </YStack>

              <XStack justifyContent="center" gap="$2" paddingBottom="$4">
                <Text color="$color10" fontFamily="$lexend">
                  Đã có tài khoản?
                </Text>
                <Text
                  color="$primary"
                  fontWeight="bold"
                  fontFamily="$lexend"
                  onPress={() => router.push("/(auth)/login")}
                >
                  Đăng nhập
                </Text>
              </XStack>
            </YStack>
          </Card>
        </YStack>
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
    <YStack
      padding="$4"
      borderWidth={2}
      borderRadius="$4"
      borderColor={isSelected ? (label === "Bé" ? "$green10" : "$blue10") : "$color5"}
      backgroundColor={isSelected ? (label === "Bé" ? "$green2" : "$blue2") : "$background"}
      alignItems="center"
      gap="$2"
      animation="quick"
      scale={isSelected ? 1.02 : 1}
    >
      {icon}
      <Text
        fontWeight="bold"
        fontFamily="$lexend"
        color={isSelected ? (label === "Bé" ? "$green10" : "$blue10") : "$color11"}
      >
        {label}
      </Text>
    </YStack>
  </Pressable>
);
