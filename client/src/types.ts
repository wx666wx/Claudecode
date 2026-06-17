export type Platform = 'douyin' | 'xiaohongshu' | 'kuaishou' | 'bilibili';

export const PLATFORM_LABELS: Record<Platform, string> = {
  douyin: '抖音',
  xiaohongshu: '小红书',
  kuaishou: '快手',
  bilibili: '哔哩哔哩',
};

export const PLATFORM_COLORS: Record<Platform, string> = {
  douyin: '#000000',
  xiaohongshu: '#fe2c55',
  kuaishou: '#ff6f00',
  bilibili: '#fb7299',
};

export interface TopicResult {
  title: string;
  style_tag: string;
  score: number;
  reason: string;
}

export interface GenerateResponse {
  topics: TopicResult[];
  generationId: number;
}

export interface FavoriteItem {
  id: number;
  platform: Platform;
  title: string;
  style_tag: string;
  score: number;
  reason: string;
  prompt: string;
  created_at: string;
}

export interface HistoryItem {
  id: number;
  platform: Platform;
  prompt: string;
  results: TopicResult[];
  created_at: string;
}
