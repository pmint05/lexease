import { LoginInput, RegisterInput } from "@/src/core/schemas/auth";
import {
  AuthResult,
  BackendAuthResponse,
  BackendUser,
  User,
  UserRole,
} from "@/src/core/types/user";
import { apiClient, getApiErrorMessage } from "@/src/data/api/apiClient";

const toBackendRole = (role: UserRole): "CHILD" | "GUARDIAN" => {
  return role === "child" ? "CHILD" : "GUARDIAN";
};
const toFrontendRole = (role: BackendUser["role"]): UserRole | null => {
  if (role === "CHILD") return "child";
  if (role === "GUARDIAN") return "guardian";
  return null;
};

export const toFrontendUser = (backendUser: BackendUser): User | null => {
  const role = toFrontendRole(backendUser.role);
  if (!role) return null;

  return {
    id: backendUser.id,
    email: backendUser.email,
    name: backendUser.displayName,
    role,
    status: backendUser.status,
  };
};

const toAuthResult = (response: BackendAuthResponse): AuthResult => {
  const user = toFrontendUser(response.user);

  if (!user) {
    return {
      success: false,
      error: "Tài khoản admin chưa được hỗ trợ trong ứng dụng này",
    };
  }

  return {
    success: true,
    user,
    token: response.accessToken,
    refreshToken: response.refreshToken,
    expiresIn: response.expiresIn,
  };
};

export const authService = {
  login: async ({ email, password }: LoginInput): Promise<AuthResult> => {
    try {
      const response = await apiClient.post<BackendAuthResponse>("/auth/login", {
        email,
        password,
      });
      return toAuthResult(response.data);
    } catch (error) {
      return {
        success: false,
        error: getApiErrorMessage(error),
      };
    }
  },

  register: async ({
    name,
    email,
    password,
    role,
  }: RegisterInput): Promise<AuthResult> => {
    try {
      const response = await apiClient.post<BackendAuthResponse>(
        "/auth/register",
        {
          email,
          password,
          displayName: name,
          role: toBackendRole(role),
        },
      );
      return toAuthResult(response.data);
    } catch (error) {
      return {
        success: false,
        error: getApiErrorMessage(error),
      };
    }
  },

  refresh: async (refreshToken: string): Promise<AuthResult> => {
    try {
      const response = await apiClient.post<BackendAuthResponse>(
        "/auth/refresh",
        { refreshToken },
      );
      return toAuthResult(response.data);
    } catch (error) {
      return {
        success: false,
        error: getApiErrorMessage(error),
      };
    }
  },

  logout: async (refreshToken: string | null): Promise<void> => {
    if (!refreshToken) return;
    await apiClient.post("/auth/logout", { refreshToken });
  },

  me: async (): Promise<User> => {
    const response = await apiClient.get<BackendUser>("/me");
    const user = toFrontendUser(response.data);

    if (!user) {
      throw new Error("Tài khoản admin chưa được hỗ trợ trong ứng dụng này");
    }

    return user;
  },

  forgotPassword: async (): Promise<AuthResult> => {
    return {
      success: false,
      error: "Tính năng quên mật khẩu chưa có endpoint backend",
    };
  },
};
