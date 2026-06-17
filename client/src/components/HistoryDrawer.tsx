import { useEffect, useState } from 'react';
import { X, Clock, ChevronRight } from 'lucide-react';
import { Sheet } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { getHistory } from '@/api';
import { PLATFORM_LABELS } from '@/types';
import type { HistoryItem } from '@/types';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function HistoryDrawer({ open, onClose }: Props) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setLoading(true);
      getHistory(1, 50)
        .then((r) => setHistory(r.history))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [open]);

  return (
    <Sheet open={open} onClose={onClose}>
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-white/60" />
            <h2 className="text-sm font-semibold">生成历史</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-lg bg-white/5 p-4">
                  <div className="mb-2 h-4 w-20 rounded bg-white/10" />
                  <div className="h-3 w-40 rounded bg-white/5" />
                </div>
              ))}
            </div>
          ) : history.length === 0 ? (
            <p className="py-10 text-center text-sm text-white/30">暂无生成历史</p>
          ) : (
            <div className="space-y-2">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="cursor-pointer rounded-lg border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10"
                  onClick={() => onClose()}
                >
                  <div className="mb-1 flex items-center gap-2">
                    <span className="rounded bg-white/10 px-1.5 py-0.5 text-xs text-white/60">
                      {PLATFORM_LABELS[item.platform]}
                    </span>
                    <span className="text-xs text-white/30">
                      {new Date(item.created_at + 'Z').toLocaleString('zh-CN')}
                    </span>
                  </div>
                  <p className="text-sm text-white/70 line-clamp-1">
                    {item.prompt || '(通用方向)'}
                  </p>
                  <div className="mt-2 flex items-center gap-1 text-xs text-white/40">
                    <span>{item.results.length} 个主题</span>
                    <ChevronRight className="h-3 w-3" />
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
