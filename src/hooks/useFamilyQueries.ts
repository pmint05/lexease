import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { CreateGuardianChildLinkRequest } from "@/src/core/types/family";
import { familyApi } from "@/src/data/api/familyApi";
import { useAuthStore } from "@/src/store/useAuthStore";

export const familyQueryKeys = {
  links: ["guardianChildLinks"] as const,
};

export const useGuardianChildLinksQuery = () => {
  const token = useAuthStore((s) => s.token);

  return useQuery({
    queryKey: familyQueryKeys.links,
    queryFn: familyApi.getChildLinks,
    enabled: Boolean(token),
    staleTime: 1000 * 60,
  });
};

export const useRequestChildLinkMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateGuardianChildLinkRequest) =>
      familyApi.requestChildLink(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: familyQueryKeys.links });
    },
  });
};

export const useAcceptChildLinkMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: familyApi.acceptChildLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: familyQueryKeys.links });
    },
  });
};

export const useRejectChildLinkMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: familyApi.rejectChildLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: familyQueryKeys.links });
    },
  });
};

export const useRevokeChildLinkMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: familyApi.revokeChildLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: familyQueryKeys.links });
    },
  });
};

