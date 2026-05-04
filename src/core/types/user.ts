export type UserRole = "child" | "guardian";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  displayName: string;
  avatarUrl?: string;
  createdAt: string;
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