import { cn } from '@/lib/utils';

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export default function TopicInput({ value, onChange }: Props) {
  return (
    <div>
      <label className="text-sm text-white/60 mb-2 block">输入主题方向（可选）</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="例如：副业赚钱、美妆教程、数码评测..."
        className={cn(
          'w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white',
          'placeholder:text-white/30',
          'focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/20',
          'transition-all duration-200',
        )}
      />
    </div>
  );
}
