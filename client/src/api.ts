import type { Platform, TopicResult, FavoriteItem, HistoryItem } from './types';

export async function generateTopics(platform: Platform, prompt?: string): Promise<{
  topics: TopicResult[];
  generationId: number;
}> {
  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ platform, prompt }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || '生成失败');
  return data;
}

export async function addFavorite(
  platform: Platform,
  title: string,
  style_tag: string,
  score: number,
  reason: string,
  prompt: string
): Promise<{ id: number }> {
  const res = await fetch('/api/favorites', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ platform, title, style_tag, score, reason, prompt }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || '收藏失败');
  return data;
}

export async function getFavorites(): Promise<{ favorites: FavoriteItem[] }> {
  const res = await fetch('/api/favorites');
  return res.json();
}

export async function deleteFavorite(id: number): Promise<void> {
  const res = await fetch(`/api/favorites/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('取消收藏失败');
}

export async function getHistory(page = 1, limit = 20): Promise<{
  history: HistoryItem[];
  total: number;
  page: number;
  limit: number;
}> {
  const res = await fetch(`/api/history?page=${page}&limit=${limit}`);
  return res.json();
}

export async function getHistoryDetail(id: number): Promise<{ generation: HistoryItem }> {
  const res = await fetch(`/api/history/${id}`);
  return res.json();
}

export async function checkApiKey(): Promise<{ hasApiKey: boolean }> {
  const res = await fetch('/api/config');
  return res.json();
}
