import { AlertTriangle } from 'lucide-react';

export default function ApiKeyWarning() {
  return (
    <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-yellow-400" />
        <div className="min-w-0">
          <p className="text-sm font-medium text-yellow-300">未配置 API Key</p>
          <p className="mt-1 text-xs text-yellow-200/60">
            请在 <code className="rounded bg-white/10 px-1 py-0.5 text-yellow-300">server/.env</code> 中设置{' '}
            <code className="rounded bg-white/10 px-1 py-0.5 text-yellow-300">DEEPSEEK_API_KEY</code>
          </p>
        </div>
      </div>
    </div>
  );
}
