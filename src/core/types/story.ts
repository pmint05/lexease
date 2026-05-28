import { Book } from "@/src/core/types/reading";
import { estimateWordTimestamps, tokenizeText } from "@/src/utils/textProcessing";

export interface PageResponse<T> {
  items: T[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
}

export interface MetadataItem {
  id: string;
  name: string;
}

export type StoryStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type TtsStatus = "PENDING" | "PROCESSING" | "READY" | "FAILED" | "INVALIDATED";

export interface StorySummary {
  id: string;
  title: string;
  genres: MetadataItem[];
  authors: MetadataItem[];
  status: StoryStatus;
  isBlockedForCurrentChild: boolean;
}

export interface StoryDetail extends StorySummary {
  content: string;
  version: number;
  ttsStatus: TtsStatus;
}

export interface StorySearchParams {
  keyword?: string;
  genreId?: string | string[];
  authorId?: string | string[];
  childId?: string;
  page?: number;
  size?: number;
}

export interface StoryAccessChangeRequest {
  childId: string;
  storyId: string;
  blocked?: boolean;
  reason?: string;
}

export interface StoryAccessResponse {
  childId: string;
  storyId: string;
  blocked: boolean;
}

const getPlaceholderCover = (title: string): string => {
  return `https://placehold.co/400x600/FFE082/333333?text=${encodeURIComponent(title)}`;
};

export const storySummaryToBook = (story: StorySummary): Book => {
  return {
    id: story.id,
    title: story.title,
    author: story.authors.map((author) => author.name).join(", ") || "LexEase",
    category: story.genres[0]?.name ?? "Khác",
    difficulty: "medium",
    coverUrl: getPlaceholderCover(story.title),
    content: "",
    words: [],
    wordCount: 0,
    estimatedMinutes: 1,
  };
};

export const storyDetailToBook = (story: StoryDetail): Book => {
  const words = tokenizeText(story.content);

  return {
    ...storySummaryToBook(story),
    content: story.content,
    words,
    wordCount: words.length,
    estimatedMinutes: Math.max(1, Math.round(words.length / 90)),
    wordTimestamps: estimateWordTimestamps(words, 1.5),
  };
};
