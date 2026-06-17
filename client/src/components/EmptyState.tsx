import { Sparkles, MousePointerClick } from 'lucide-react';
import type { Platform } from '@/types';
import { PLATFORM_LABELS } from '@/types';

interface Props {
  platform: Platform | null;
}

export default function EmptyState({ platform }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="mb-6 rounded-full bg-white/5 p-4">
        <Sparkles className="h-8 w-8 text-yellow-400" />
      </div>
      <h2 className="mb-2 text-xl font-semibold text-white">
        {platform ? `准备就绪 · ${PLATFORM_LABELS[platform]}` : '选择一个平台开始'}
      </h2>
      <p className="mb-6 text-center text-sm text-white/40">
        {platform
          ? '点击「生成爆款主题」让 AI 为你创作 10 个爆款选题'
          : '先在左侧选择一个平台，然后点击生成按钮'}
      </p>
      {!platform && (
        <div className="flex items-center gap-1 text-xs text-white/30">
          <MousePointerClick className="h-3.5 w-3.5" />
          选择平台后即可生成
        </div>
      )}
    </div>
  );
}
