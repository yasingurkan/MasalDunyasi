export interface StoryData {
  title: string;
  slug: string;
  content: string;
  ageMin: number;
  ageMax: number;
  source: string;
  sourceType?: "internet" | "generated";
  characters: string[];
  tags: string[];
  imageQuery: string;
  featured?: boolean;
  uploadedAt: Date;
}
