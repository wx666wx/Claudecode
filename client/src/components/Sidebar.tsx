import { History, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PlatformSelector from './PlatformSelector';
import TopicInput from './TopicInput';
import GenerateButton from './GenerateButton';
import ApiKeyWarning from './ApiKeyWarning';
import type { Platform } from '@/types';

interface Props {
  platform: Platform | null;
  onPlatformSelect: (p: Platform) => void;
  topic: string;
  onTopicChange: (v: string) => void;
  onGenerate: () => void;
  loading: boolean;
  canGenerate: boolean;
  hasApiKey: boolean;
  onOpenHistory: () => void;
  onOpenFavorites: () => void;
}

export default function Sidebar({
  platform, onPlatformSelect, topic, onTopicChange,
  onGenerate, loading, canGenerate, hasApiKey,
  onOpenHistory, onOpenFavorites,
}: Props) {
  return (
    <aside className="flex w-full flex-col gap-6 lg:w-72 xl:w-80">
      {!hasApiKey && <ApiKeyWarning />}
      <PlatformSelector selected={platform} onSelect={onPlatformSelect} />
      <TopicInput value={topic} onChange={onTopicChange} />
      <GenerateButton
        onClick={onGenerate}
        loading={loading}
        disabled={!canGenerate}
      />
      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1 gap-1.5" onClick={onOpenHistory}>
          <History className="h-3.5 w-3.5" /> 历史
        </Button>
        <Button variant="outline" size="sm" className="flex-1 gap-1.5" onClick={onOpenFavorites}>
          <Heart className="h-3.5 w-3.5" /> 收藏
        </Button>
      </div>
    </aside>
  );
}
