import type { Platform } from '@/types';
import { PLATFORM_LABELS } from '@/types';
import { cn } from '@/lib/utils';

interface Props {
  selected: Platform | null;
  onSelect: (p: Platform) => void;
}

const platforms: Platform[] = ['douyin', 'xiaohongshu', 'kuaishou', 'bilibili'];

export default function PlatformSelector({ selected, onSelect }: Props) {
  return (
    <div>
      <label className="text-sm text-white/60 mb-2 block">选择平台</label>
      <div className="grid grid-cols-2 gap-2">
        {platforms.map((p) => (
          <button
            key={p}
            onClick={() => onSelect(p)}
            className={cn(
              'rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 border',
              selected === p
                ? 'border-white bg-white/10 text-white'
                : 'border-white/10 bg-white/5 text-white/50 hover:border-white/20 hover:text-white/80',
            )}
          >
            {PLATFORM_LABELS[p]}
          </button>
        ))}
      </div>
    </div>
  );
}
