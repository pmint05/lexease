import { Account } from "@/src/store/useAuthStore";

/**
 * Mock Auth Data
 * Centralized store for mock user accounts
 */

export const mockAccounts: Account[] = [
  {
    id: "guardian-1",
    email: "admin@gmail.com",
    name: "Admin Guardian",
    password: "12345",
    role: "guardian",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "child-1",
    email: "child1@gmail.com",
    name: "Bé Thứ Nhất",
    password: "12345",
    role: "child",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
  {
    id: "child-2",
    email: "child2@gmail.com",
    name: "Bé Thứ Hai",
    password: "12345",
    role: "child",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  },
];
