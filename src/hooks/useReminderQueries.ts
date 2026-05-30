import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reminderApi } from "@/src/data/api/reminderApi";
import { CreateReminderRequest, PatchReminderRequest } from "@/src/core/types";

export const reminderQueryKeys = {
  list: (childId: string) => ["reminders", childId] as const,
};

export const useRemindersQuery = (childId: string) => {
  return useQuery({
    queryKey: reminderQueryKeys.list(childId),
    queryFn: () => reminderApi.listForChild(childId),
    enabled: Boolean(childId),
  });
};

export const useCreateReminderMutation = (childId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateReminderRequest) => reminderApi.create(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reminderQueryKeys.list(childId) });
    },
  });
};

export const usePatchReminderMutation = (childId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: string; request: PatchReminderRequest }) =>
      reminderApi.patch(id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reminderQueryKeys.list(childId) });
    },
  });
};

export const useDeleteReminderMutation = (childId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => reminderApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reminderQueryKeys.list(childId) });
    },
  });
};
