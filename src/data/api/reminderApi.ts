import {
  CreateReminderRequest,
  PatchReminderRequest,
  ReminderResponse,
} from "@/src/core/types";
import { apiClient } from "@/src/data/api/apiClient";

export const reminderApi = {
  create: async (request: CreateReminderRequest): Promise<ReminderResponse> => {
    const response = await apiClient.post<ReminderResponse>("/reminders", request);
    return response.data;
  },

  listForChild: async (childId: string): Promise<ReminderResponse[]> => {
    const response = await apiClient.get<ReminderResponse[]>(
      `/children/${childId}/reminders`,
    );
    return response.data;
  },

  patch: async (
    id: string,
    request: PatchReminderRequest,
  ): Promise<ReminderResponse> => {
    const response = await apiClient.patch<ReminderResponse>(
      `/reminders/${id}`,
      request,
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/reminders/${id}`);
  },
};
