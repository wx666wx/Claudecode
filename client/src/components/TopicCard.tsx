import { useState, useEffect } from 'react';
import { Copy, Heart, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { addFavorite, deleteFavorite } from '@/api';
import { toast } from 'sonner';
import type { TopicResult, Platform } from '@/types';

const STYLE_COLORS: Record<string, string> = {
  '悬念式': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  '痛点式': 'bg-red-500/20 text-red-300 border-red-500/30',
  '反差式': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  '热点借势': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  '情感共鸣': 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  '数据震撼': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  '干货前置': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  '挑战互动': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  '人设代入': 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
  '反直觉': 'bg-rose-500/20 text-rose-300 border-rose-500/30',
};

function getScoreColor(score: number): string {
  if (score >= 9) return 'text-red-400';
  if (score >= 7) return 'text-orange-400';
  if (score >= 5) return 'text-yellow-400';
  return 'text-gray-400';
}

interface Props {
  topic: TopicResult;
  index: number;
  platform: Platform;
  prompt: string;
  isFavorited: boolean;
  favoriteId?: number;
  onFavoritedChange: (title: string, nowFavorited: boolean, favoriteId?: number) => void;
}

export default function TopicCard({ topic, index, platform, prompt, isFavorited, favoriteId, onFavoritedChange }: Props) {
  const [visible, setVisible] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), index * 80);
    return () => clearTimeout(timer);
  }, [index]);

  const handleCopy = () => {
    navigator.clipboard.writeText(topic.title).then(() => {
      toast.success('已复制到剪贴板');
    });
  };

  const handleFavorite = async () => {
    if (favoriteLoading) return;
    setFavoriteLoading(true);
    try {
      if (isFavorited && favoriteId) {
        await deleteFavorite(favoriteId);
        onFavoritedChange(topic.title, false);
        toast.success('已取消收藏');
      } else {
        const result = await addFavorite(platform, topic.title, topic.style_tag, topic.score, topic.reason, prompt);
        onFavoritedChange(topic.title, true, result.id);
        toast.success('已收藏');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '操作失败');
    } finally {
      setFavoriteLoading(false);
    }
  };

  return (
    <div
      className={cn(
        'transition-all duration-500',
        visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
      )}
    >
      <Card className="group">
        <CardContent className="p-5">
          <div className="mb-3 flex items-start justify-between gap-3">
            <h3 className="text-base font-semibold leading-snug text-white">
              {topic.title}
            </h3>
            <div className="flex items-center gap-1 whitespace-nowrap text-sm font-medium">
              <Star className={cn('h-3.5 w-3.5 fill-current', getScoreColor(topic.score))} />
              <span className={getScoreColor(topic.score)}>{topic.score}/10</span>
            </div>
          </div>

          <div className="mb-3">
            <Badge
              className={cn(
                'border text-xs',
                STYLE_COLORS[topic.style_tag] || 'bg-white/10 text-white',
              )}
            >
              {topic.style_tag}
            </Badge>
          </div>

          <p className="text-sm leading-relaxed text-white/50">{topic.reason}</p>

          <div className="mt-4 flex gap-2 lg:opacity-0 lg:transition-opacity lg:group-hover:opacity-100">
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs" onClick={handleCopy}>
              <Copy className="h-3.5 w-3.5" /> 复制
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn('gap-1.5 text-xs', isFavorited && 'text-red-400')}
              onClick={handleFavorite}
              disabled={favoriteLoading}
            >
              <Heart className={cn('h-3.5 w-3.5', isFavorited && 'fill-current')} />
              {isFavorited ? '已收藏' : '收藏'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
