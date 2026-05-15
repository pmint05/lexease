import { z } from "zod";

/**
 * Auth Schemas
 * Defined using Zod for validation across the app
 */

export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, "Email không được để trống")
    .email("Email không đúng định dạng"),
  password: z
    .string()
    .min(1, "Mật khẩu không được để trống")
    .min(5, "Mật khẩu phải có ít nhất 5 ký tự"),
});

export const RegisterSchema = z
  .object({
    name: z.string().min(1, "Họ và tên không được để trống"),
    email: z
      .string()
      .min(1, "Email không được để trống")
      .email("Email không đúng định dạng"),
    password: z
      .string()
      .min(1, "Mật khẩu không được để trống")
      .min(5, "Mật khẩu phải có ít nhất 5 ký tự"),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
    role: z.enum(["child", "guardian"], {
      required_error: "Vui lòng chọn vai trò",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export const ForgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email không được để trống")
    .email("Email không đúng định dạng"),
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;
