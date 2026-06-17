export type Platform = 'douyin' | 'xiaohongshu' | 'kuaishou' | 'bilibili';

export interface TopicResult {
  title: string;
  style_tag: string;
  score: number;
  reason: string;
}

export interface GenerateRequest {
  platform: Platform;
  prompt?: string;
}

export interface GenerateResponse {
  topics: TopicResult[];
  generationId: number;
}

export interface FavoriteRow {
  id: number;
  platform: Platform;
  title: string;
  style_tag: string;
  score: number;
  reason: string;
  prompt: string;
  created_at: string;
}

export interface HistoryRow {
  id: number;
  platform: Platform;
  prompt: string;
  results: string;  // JSON string
  created_at: string;
}
