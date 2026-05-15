import {
  Account,
  AuthResult,
  User,
  UserRole,
} from "@/src/core/types/user";
import { mockAccounts } from "@/src/data/local/mockAuthData";
import { LoginInput, RegisterInput } from "@/src/core/schemas/auth";

/**
 * Auth Service
 * Simulated API service for authentication
 * Ready to be replaced with Axios calls
 */

const DELAY = 1000;

// Internal state for mock data persistence in current session
let localAccounts = [...mockAccounts];

const normalizeEmail = (value: string): string => value.trim().toLowerCase();

export const authService = {
  login: async ({ email, password }: LoginInput): Promise<AuthResult> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const normalizedEmail = normalizeEmail(email);
        const account = localAccounts.find(
          (item) =>
            item.email === normalizedEmail && item.password === password,
        );

        if (!account) {
          return resolve({
            success: false,
            error: "Email hoặc mật khẩu không đúng",
          });
        }

        const user: User = {
          id: account.id,
          email: account.email,
          name: account.name,
          role: account.role,
        };

        resolve({
          success: true,
          user,
          token: `mock-token-${Date.now()}`,
        });
      }, DELAY);
    });
  },

  register: async ({
    name,
    email,
    password,
    role,
  }: RegisterInput): Promise<AuthResult> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const normalizedEmail = normalizeEmail(email);
        const existing = localAccounts.find(
          (account) => account.email === normalizedEmail,
        );

        if (existing) {
          return resolve({
            success: false,
            error: "Email này đã được đăng ký",
          });
        }

        const now = new Date().toISOString();
        const userId = `user-${Date.now()}`;
        const account: Account = {
          id: userId,
          name: name.trim(),
          email: normalizedEmail,
          password,
          role: role as UserRole,
          createdAt: now,
        };

        localAccounts.push(account);

        const user: User = {
          id: account.id,
          name: account.name,
          email: account.email,
          role: account.role,
        };

        resolve({
          success: true,
          user,
          token: `mock-token-${Date.now()}`,
        });
      }, DELAY);
    });
  },

  forgotPassword: async (email: string): Promise<AuthResult> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const normalizedEmail = normalizeEmail(email);
        const exists = localAccounts.some(
          (account) => account.email === normalizedEmail,
        );

        if (!exists) {
          return resolve({
            success: false,
            error: "Email không tồn tại trong hệ thống",
          });
        }

        resolve({
          success: true,
        });
      }, DELAY);
    });
  },
};
