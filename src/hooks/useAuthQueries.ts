import { useMutation } from "@tanstack/react-query";
import { authService } from "@/src/data/api/authService";
import { useAuthStore } from "@/src/store/useAuthStore";
import { LoginInput, RegisterInput } from "@/src/core/schemas/auth";
import { AuthResult } from "@/src/core/types/user";

/**
 * Auth Queries & Mutations
 * Using Tanstack Query for handling async auth operations
 */

export const useLoginMutation = () => {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (data: LoginInput) => authService.login(data),
    onSuccess: (result: AuthResult) => {
      if (result.success && result.token && result.user) {
        setAuth({
          token: result.token,
          user: result.user,
        });
      }
    },
  });
};

export const useRegisterMutation = () => {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (data: RegisterInput) => authService.register(data),
    onSuccess: (result: AuthResult) => {
      if (result.success && result.token && result.user) {
        setAuth({
          token: result.token,
          user: result.user,
        });
      }
    },
  });
};

export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
  });
};
