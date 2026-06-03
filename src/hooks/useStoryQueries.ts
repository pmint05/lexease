import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { StorySearchParams } from "@/src/core/types/story";
import { storyApi } from "@/src/data/api/storyApi";
import { useAuthStore } from "@/src/store/useAuthStore";

export const storyQueryKeys = {
  all: ["stories"] as const,
  list: (params: StorySearchParams) => [...storyQueryKeys.all, "list", params],
  detail: (id: string, childId?: string) =>
    [...storyQueryKeys.all, "detail", id, childId] as const,
  genres: ["genres"] as const,
  authors: ["authors"] as const,
};

export const useStoriesQuery = (params: StorySearchParams = {}) => {
  const token = useAuthStore((s) => s.token);

  return useQuery({
    queryKey: storyQueryKeys.list(params),
    queryFn: () => storyApi.getStories(params),
    enabled: Boolean(token),
    staleTime: 1000 * 60 * 5,
  });
};

export const useStoryQuery = (id?: string, childId?: string) => {
  const token = useAuthStore((s) => s.token);

  return useQuery({
    queryKey: storyQueryKeys.detail(id ?? "", childId),
    queryFn: () => storyApi.getStory(id ?? "", childId),
    enabled: Boolean(token && id),
    staleTime: 1000 * 60 * 5,
  });
};

export const useGenresQuery = () => {
  const token = useAuthStore((s) => s.token);

  return useQuery({
    queryKey: storyQueryKeys.genres,
    queryFn: storyApi.getGenres,
    enabled: Boolean(token),
    staleTime: 1000 * 60 * 15,
  });
};

export const useAuthorsQuery = () => {
  const token = useAuthStore((s) => s.token);

  return useQuery({
    queryKey: storyQueryKeys.authors,
    queryFn: storyApi.getAuthors,
    enabled: Boolean(token),
    staleTime: 1000 * 60 * 15,
  });
};

export const useBlockStoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: storyApi.blockStory,
    onMutate: async (variables) => {
      const queryKey = storyQueryKeys.detail(variables.storyId, variables.childId);
      
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous value
      const previousStory = queryClient.getQueryData(queryKey);

      // Optimistically update to the new value
      if (previousStory) {
        queryClient.setQueryData(queryKey, {
          ...(previousStory as any),
          isBlockedForCurrentChild: true,
        });
      }

      // Return a context object with the snapshotted value
      return { previousStory, queryKey };
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousStory) {
        queryClient.setQueryData(context.queryKey, context.previousStory);
      }
    },
    onSettled: (data, error, variables) => {
      // Always refetch after error or success to ensure data is correct
      queryClient.invalidateQueries({
        queryKey: storyQueryKeys.detail(variables.storyId, variables.childId),
      });
      queryClient.invalidateQueries({
        queryKey: storyQueryKeys.all,
      });
    },
  });
};

export const useUnblockStoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: storyApi.unblockStory,
    onMutate: async (variables) => {
      const queryKey = storyQueryKeys.detail(variables.storyId, variables.childId);
      
      await queryClient.cancelQueries({ queryKey });

      const previousStory = queryClient.getQueryData(queryKey);

      if (previousStory) {
        queryClient.setQueryData(queryKey, {
          ...(previousStory as any),
          isBlockedForCurrentChild: false,
        });
      }

      return { previousStory, queryKey };
    },
    onError: (err, variables, context) => {
      if (context?.previousStory) {
        queryClient.setQueryData(context.queryKey, context.previousStory);
      }
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({
        queryKey: storyQueryKeys.detail(variables.storyId, variables.childId),
      });
      queryClient.invalidateQueries({
        queryKey: storyQueryKeys.all,
      });
    },
  });
};
