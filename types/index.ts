export interface AgeCategory {
  id: number;
  slug: string;
  name: string;
  label: string;
  ageMin: number;
  ageMax: number;
  description: string;
  icon: string;
  color: string;
  _count?: { stories: number };
  createdAt: Date;
}

export interface Story {
  id: number;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  ageMin: number;
  ageMax: number;
  readingMinutes: number;
  wordCount: number;
  source: string;
  characters: string[];
  tags: string[];
  imageQuery: string;
  imageUrl?: string | null;
  categoryId: number;
  category?: AgeCategory;
  sourceType: string;
  featured: boolean;
  viewCount: number;
  uploadedAt: Date;
  updatedAt: Date;
}

// Category fields actually selected by list/search queries (subset of AgeCategory)
export type PartialCategory = Pick<AgeCategory, "name" | "slug" | "color"> &
  Partial<AgeCategory>;

export interface StoryListItem
  extends Omit<Story, "content" | "characters" | "tags" | "category"> {
  category?: PartialCategory;
}

export type SortOrder = "tarih-yeni" | "tarih-eski" | "a-z" | "z-a";

export interface PaginatedStories {
  stories: StoryListItem[];
  total: number;
  page: number;
  totalPages: number;
  perPage: number;
}

export interface StoryData {
  title: string;
  slug: string;
  content: string;
  ageMin: number;
  ageMax: number;
  source: string;
  characters: string[];
  tags: string[];
  imageQuery: string;
  featured?: boolean;
  uploadedAt: Date;
}

export interface CookieConsent {
  essential: true;
  analytics: boolean;
  preferences: boolean;
  timestamp: number;
}

export type AudioState = "idle" | "playing" | "paused";
