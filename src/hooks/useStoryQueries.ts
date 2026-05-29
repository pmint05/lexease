import { useMutation, useQuery } from "@tanstack/react-query";

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
  return useMutation({
    mutationFn: storyApi.blockStory,
  });
};

export const useUnblockStoryMutation = () => {
  return useMutation({
    mutationFn: storyApi.unblockStory,
  });
};
