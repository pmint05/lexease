import {
  MetadataItem,
  PageResponse,
  StoryDetail,
  StorySearchParams,
  StorySummary,
  StoryAccessChangeRequest,
  StoryAccessResponse,
} from "@/src/core/types/story";
import { apiClient } from "@/src/data/api/apiClient";

const appendRepeatedParam = (
  params: URLSearchParams,
  key: string,
  value?: string | string[],
): void => {
  if (!value) return;
  const values = Array.isArray(value) ? value : [value];
  values.forEach((item) => params.append(key, item));
};

const toSearchParams = (input: StorySearchParams = {}): URLSearchParams => {
  const params = new URLSearchParams();

  if (input.keyword) params.set("keyword", input.keyword);
  if (input.childId) params.set("childId", input.childId);
  if (input.page !== undefined) params.set("page", String(input.page));
  if (input.size !== undefined) params.set("size", String(input.size));
  appendRepeatedParam(params, "genreId", input.genreId);
  appendRepeatedParam(params, "authorId", input.authorId);

  return params;
};

export const storyApi = {
  getStories: async (
    params: StorySearchParams = {},
  ): Promise<PageResponse<StorySummary>> => {
    const searchParams = toSearchParams(params);
    const queryString = searchParams.toString();
    const response = await apiClient.get<PageResponse<StorySummary>>(
      `/stories${queryString ? `?${queryString}` : ""}`,
    );
    return response.data;
  },

  getStory: async (
    id: string,
    childId?: string,
  ): Promise<StoryDetail> => {
    const params = new URLSearchParams();
    if (childId) params.set("childId", childId);
    const queryString = params.toString();
    const response = await apiClient.get<StoryDetail>(
      `/stories/${id}${queryString ? `?${queryString}` : ""}`,
    );
    return response.data;
  },

  getGenres: async (): Promise<MetadataItem[]> => {
    const response = await apiClient.get<MetadataItem[]>("/genres");
    return response.data;
  },

  getAuthors: async (): Promise<MetadataItem[]> => {
    const response = await apiClient.get<MetadataItem[]>("/authors");
    return response.data;
  },

  blockStory: async (
    request: StoryAccessChangeRequest,
  ): Promise<StoryAccessResponse> => {
    const response = await apiClient.post<StoryAccessResponse>(
      "/story-access/block",
      { ...request, blocked: true },
    );
    return response.data;
  },

  unblockStory: async (
    request: StoryAccessChangeRequest,
  ): Promise<StoryAccessResponse> => {
    const response = await apiClient.post<StoryAccessResponse>(
      "/story-access/unblock",
      { ...request, blocked: false },
    );
    return response.data;
  },
};
