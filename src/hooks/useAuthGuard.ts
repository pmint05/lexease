import { useAuthStore } from "@/src/store/useAuthStore";
import { useRootNavigationState, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

/**
 * useAuthGuard Hook
 * Handles navigation redirects based on authentication state and user roles
 */
export const useAuthGuard = () => {
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();

  const { token, role, _hasHydrated } = useAuthStore();

  useEffect(() => {
    // Wait for navigation state to be ready
    if (!navigationState?.key || !_hasHydrated) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inChildGroup = segments[0] === "(child)";
    const inGuardianGroup = segments[0] === "(guardian)";

    // If not logged in and not in auth group, redirect to login
    if (!token && !inAuthGroup) {
      router.replace("/(auth)/login");
      return;
    }

    // If logged in and in auth group, redirect to appropriate dashboard
    if (token && inAuthGroup) {
      if (role === "child") {
        router.replace("/(child)/(tabs)/library");
      } else if (role === "guardian") {
        router.replace("/(guardian)/(tabs)/dashboard");
      }
      return;
    }

    // Role-based protection
    if (token) {
      if (role === "child" && inGuardianGroup) {
        router.replace("/(child)/(tabs)/library");
      } else if (role === "guardian" && inChildGroup) {
        router.replace("/(guardian)/(tabs)/dashboard");
      }
    }
  }, [token, role, segments, _hasHydrated, navigationState?.key]);
};
