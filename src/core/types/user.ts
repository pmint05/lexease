export type UserRole = "child" | "guardian";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
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
}

export interface Child extends User {
  role: "child";
  guardianId: string;
  readingLevel: 1 | 2 | 3;
}

export interface Guardian extends User {
  role: "guardian";
  childIds: string[];
}