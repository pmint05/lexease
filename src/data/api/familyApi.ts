import {
  CreateGuardianChildLinkRequest,
  GuardianChildLinkResponse,
} from "@/src/core/types/family";
import { apiClient } from "@/src/data/api/apiClient";

export const familyApi = {
  requestChildLink: async (
    request: CreateGuardianChildLinkRequest,
  ): Promise<GuardianChildLinkResponse> => {
    const response = await apiClient.post<GuardianChildLinkResponse>(
      "/guardian-child-links",
      request,
    );
    return response.data;
  },

  getChildLinks: async (): Promise<GuardianChildLinkResponse[]> => {
    const response = await apiClient.get<GuardianChildLinkResponse[]>(
      "/guardian-child-links",
    );
    return response.data;
  },

  acceptChildLink: async (id: string): Promise<GuardianChildLinkResponse> => {
    const response = await apiClient.post<GuardianChildLinkResponse>(
      `/guardian-child-links/${id}/accept`,
    );
    return response.data;
  },

  rejectChildLink: async (id: string): Promise<GuardianChildLinkResponse> => {
    const response = await apiClient.post<GuardianChildLinkResponse>(
      `/guardian-child-links/${id}/reject`,
    );
    return response.data;
  },

  revokeChildLink: async (id: string): Promise<void> => {
    await apiClient.delete(`/guardian-child-links/${id}`);
  },
};

