import { useEffect, useState } from 'react';
import { X, Heart, Trash2 } from 'lucide-react';
import { Sheet } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { getFavorites, deleteFavorite } from '@/api';
import { PLATFORM_LABELS } from '@/types';
import { toast } from 'sonner';
import type { FavoriteItem } from '@/types';
import { cn } from '@/lib/utils';

interface Props {
  open: boolean;
  onClose: () => void;
  favoritedIds: Map<string, number>;
  onFavoritedIdsChange: (ids: Map<string, number>) => void;
}

const STYLE_COLORS: Record<string, string> = {
  '悬念式': 'bg-yellow-500/20 text-yellow-300',
  '痛点式': 'bg-red-500/20 text-red-300',
  '反差式': 'bg-purple-500/20 text-purple-300',
  '热点借势': 'bg-blue-500/20 text-blue-300',
  '情感共鸣': 'bg-pink-500/20 text-pink-300',
  '数据震撼': 'bg-cyan-500/20 text-cyan-300',
  '干货前置': 'bg-emerald-500/20 text-emerald-300',
  '挑战互动': 'bg-orange-500/20 text-orange-300',
  '人设代入': 'bg-indigo-500/20 text-indigo-300',
  '反直觉': 'bg-rose-500/20 text-rose-300',
};

export default function FavoritesDrawer({ open, onClose, favoritedIds, onFavoritedIdsChange }: Props) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(false);

  const load = () => {
    setLoading(true);
    getFavorites()
      .then((r) => {
        setFavorites(r.favorites);
        onFavoritedIdsChange(new Map(r.favorites.map((f) => [f.title, f.id])));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (open) load();
  }, [open]);

  const handleDelete = async (id: number, title: string) => {
    try {
      await deleteFavorite(id);
      setFavorites((prev) => prev.filter((f) => f.id !== id));
      const next = new Map(favoritedIds);
      next.delete(title);
      onFavoritedIdsChange(next);
      toast.success('已取消收藏');
    } catch {
      toast.error('取消收藏失败');
    }
  };

  return (
    <Sheet open={open} onClose={onClose}>
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-red-400" />
            <h2 className="text-sm font-semibold">我的收藏</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-lg bg-white/5 p-4">
                  <div className="mb-2 h-4 w-3/4 rounded bg-white/10" />
                  <div className="h-3 w-1/4 rounded bg-white/5" />
                </div>
              ))}
            </div>
          ) : favorites.length === 0 ? (
            <p className="py-10 text-center text-sm text-white/30">暂无收藏</p>
          ) : (
            <div className="space-y-3">
              {favorites.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg border border-white/10 bg-white/5 p-4"
                >
                  <div className="mb-1 flex items-center gap-2">
                    <span className="rounded bg-white/10 px-1.5 py-0.5 text-xs text-white/60">
                      {PLATFORM_LABELS[item.platform]}
                    </span>
                    <span className={cn(
                      'rounded px-1.5 py-0.5 text-xs',
                      STYLE_COLORS[item.style_tag] || 'bg-white/10 text-white/60'
                    )}>
                      {item.style_tag}
                    </span>
                  </div>
                  <p className="mb-2 text-sm font-medium text-white">{item.title}</p>
                  <p className="mb-3 text-xs text-white/40 line-clamp-2">{item.reason}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/30">
                      {new Date(item.created_at + 'Z').toLocaleString('zh-CN')}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 gap-1 text-xs text-red-400 hover:text-red-300"
                      onClick={() => handleDelete(item.id, item.title)}
                    >
                      <Trash2 className="h-3.5 w-3.5" /> 取消收藏
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Sheet>
  );
}
