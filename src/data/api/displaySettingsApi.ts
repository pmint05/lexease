import {
  DisplaySettingsResponse,
  SaveDisplaySettingsRequest,
} from "@/src/core/types/config";
import { apiClient } from "@/src/data/api/apiClient";

export const displaySettingsApi = {
  getDisplaySettings: async (
    childId: string,
  ): Promise<DisplaySettingsResponse> => {
    const response = await apiClient.get<DisplaySettingsResponse>(
      `/children/${childId}/display-settings`,
    );
    return response.data;
  },

  saveDisplaySettings: async (
    childId: string,
    request: SaveDisplaySettingsRequest,
  ): Promise<DisplaySettingsResponse> => {
    const response = await apiClient.put<DisplaySettingsResponse>(
      `/children/${childId}/display-settings`,
      request,
    );
    return response.data;
  },

  resetDisplaySettings: async (
    childId: string,
  ): Promise<DisplaySettingsResponse> => {
    const response = await apiClient.post<DisplaySettingsResponse>(
      `/children/${childId}/display-settings/reset`,
    );
    return response.data;
  },
};

