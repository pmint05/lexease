import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
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
          refreshToken: result.refreshToken,
          expiresIn: result.expiresIn,
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
          refreshToken: result.refreshToken,
          expiresIn: result.expiresIn,
        });
      }
    },
  });
};

export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: (_email: string) => authService.forgotPassword(),
  });
};

export const useMeQuery = () => {
  const token = useAuthStore((s) => s.token);
  const setUser = useAuthStore((s) => s.setUser);

  const query = useQuery({
    queryKey: ["me"],
    queryFn: authService.me,
    enabled: Boolean(token),
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (query.data) {
      setUser(query.data);
    }
  }, [query.data, setUser]);

  return query;
};

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  const refreshToken = useAuthStore((s) => s.refreshToken);
  const logout = useAuthStore((s) => s.logout);

  return useMutation({
    mutationFn: () => authService.logout(refreshToken),
    onSettled: () => {
      logout();
      queryClient.clear();
    },
  });
};
