export type UserRole = "child" | "guardian";
export type BackendUserRole = "CHILD" | "GUARDIAN" | "ADMIN";
export type BackendUserStatus = "ACTIVE" | "DISABLED";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status?: BackendUserStatus;
  avatarUrl?: string;
  points?: number; // Hệ thống điểm thưởng
}

export interface Account extends User {
  password: string;
  createdAt: string;
}

export interface AuthResult {
  success: boolean;
  error?: string;
  user?: User;
  token?: string;
  refreshToken?: string;
  expiresIn?: number;
}

export interface BackendUser {
  id: string;
  email: string;
  displayName: string;
  role: BackendUserRole;
  status: BackendUserStatus;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface BackendAuthResponse extends AuthTokens {
  user: BackendUser;
}

export interface Child extends User {
  role: "child";
  guardianId: string;
  readingLevel: 1 | 2 | 3;
  points: number; // Điểm thưởng cho trẻ
}

export interface Guardian extends User {
  role: "guardian";
  childIds: string[];
}
