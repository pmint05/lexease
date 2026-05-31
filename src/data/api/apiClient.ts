import { useAuthStore } from "@/src/store/useAuthStore";
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
  isAxiosError,
} from "axios";

/**
 * API Client
 * Centralized Axios instance with:
 * - Base URL configuration
 * - Auth token interceptor
 * - Error handling and retry logic
 * - Request/response transformation
 */

// Configuration
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080/api";
const API_TIMEOUT = 10000; // 10 seconds

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    id: string;
    email: string;
    displayName: string;
    role: "CHILD" | "GUARDIAN" | "ADMIN";
    status: "ACTIVE" | "DISABLED";
  };
}

export interface ApiErrorDetail {
  field?: string;
  message?: string;
  [key: string]: unknown;
}

export interface ApiErrorResponse {
  code: string;
  message: string;
  details?: ApiErrorDetail[];
}

export const getApiBaseUrl = (): string => API_BASE_URL;

export const resolveApiUrl = (url?: string | null): string | null => {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  return `${API_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
};

export const getApiErrorMessage = (error: unknown): string => {
  if (isAxiosError<ApiErrorResponse>(error)) {
    return (
      error.response?.data?.message ||
      error.response?.data?.code ||
      error.message ||
      "Không thể kết nối máy chủ"
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Đã có lỗi xảy ra";
};

const toFrontendRole = (
  role: RefreshResponse["user"]["role"],
): "child" | "guardian" | null => {
  if (role === "CHILD") return "child";
  if (role === "GUARDIAN") return "guardian";
  return null;
};

// Create Axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Token Refresh Queue Management
 */
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

/**
 * Request Interceptor
 * Adds auth token to all requests
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { token } = useAuthStore.getState();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

/**
 * Response Interceptor
 * Handles errors and token refresh logic with queuing to prevent race conditions
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const { refreshToken, setAuth, logout } = useAuthStore.getState();

      if (!refreshToken) {
        isRefreshing = false;
        logout();
        return Promise.reject(error);
      }

      try {
        const refreshResponse: AxiosResponse<RefreshResponse> =
          await axios.post(
            `${API_BASE_URL}/auth/refresh`,
            { refreshToken },
            {
              timeout: API_TIMEOUT,
              headers: { "Content-Type": "application/json" },
            },
          );
        const frontendRole = toFrontendRole(refreshResponse.data.user.role);

        if (!frontendRole) {
          throw new Error("Invalid role");
        }

        const newToken = refreshResponse.data.accessToken;

        setAuth({
          token: newToken,
          refreshToken: refreshResponse.data.refreshToken,
          expiresIn: refreshResponse.data.expiresIn,
          user: {
            id: refreshResponse.data.user.id,
            email: refreshResponse.data.user.email,
            name: refreshResponse.data.user.displayName,
            role: frontendRole,
            status: refreshResponse.data.user.status,
          },
        });

        processQueue(null, newToken);
        isRefreshing = false;

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        logout();
        return Promise.reject(refreshError);
      }
    }

    // Handle network errors
    if (!error.response) {
      console.error("Network error:", error.message);
    }

    return Promise.reject(error);
  },
);

/**
 * Common API Response Type
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
