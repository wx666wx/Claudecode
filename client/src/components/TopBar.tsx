import { Sparkles } from 'lucide-react';

export default function TopBar() {
  return (
    <header className="flex items-center justify-between border-b border-white/10 px-6 py-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-yellow-400" />
        <h1 className="text-lg font-semibold">AI 爆款主题生成器</h1>
      </div>
    </header>
  );
}
