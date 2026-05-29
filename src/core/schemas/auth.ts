import { z } from "zod";

/**
 * Auth Schemas
 * Defined using Zod for validation across the app
 */

const AUTH_ROLS = ["child", "guardian"] as const;
const authRolesEnum = z.enum(AUTH_ROLS, {
  error: "Vui lòng chọn vai trò",
});

export const LoginSchema = z.object({
  email: z.email("Email không đúng định dạng"),
  password: z
    .string()
    .min(1, "Mật khẩu không được để trống")
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
});

export const RegisterSchema = z
  .object({
    name: z.string().min(1, "Họ và tên không được để trống"),
    email: z.email("Email không đúng định dạng"),
    password: z
      .string()
      .min(1, "Mật khẩu không được để trống")
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
    role: authRolesEnum,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export const ForgotPasswordSchema = z.object({
  email: z.email("Email không đúng định dạng"),
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;
