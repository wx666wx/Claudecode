import { useEffect, useState, useCallback } from 'react';
import { Toaster, toast } from 'sonner';
import TopBar from './components/TopBar';
import Sidebar from './components/Sidebar';
import TopicGrid from './components/TopicGrid';
import HistoryDrawer from './components/HistoryDrawer';
import FavoritesDrawer from './components/FavoritesDrawer';
import { checkApiKey, generateTopics } from './api';
import type { Platform, TopicResult } from './types';

export default function App() {
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<TopicResult[] | null>(null);
  const [hasApiKey, setHasApiKey] = useState(true);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [favoritedIds, setFavoritedIds] = useState<Map<string, number>>(new Map());
  const [currentPrompt, setCurrentPrompt] = useState('');

  useEffect(() => {
    checkApiKey().then((r) => setHasApiKey(r.hasApiKey)).catch(() => {});
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!platform) return;
    setLoading(true);
    setCurrentPrompt(topic);
    try {
      const data = await generateTopics(platform, topic || undefined);
      setResults(data.topics);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '生成失败');
    } finally {
      setLoading(false);
    }
  }, [platform, topic]);

  const canGenerate = platform !== null && !loading && hasApiKey;

  return (
    <div className="min-h-screen bg-surface text-white">
      <TopBar />
      <div className="mx-auto flex max-w-7xl flex-col gap-6 p-6 lg:flex-row">
        <Sidebar
          platform={platform}
          onPlatformSelect={setPlatform}
          topic={topic}
          onTopicChange={setTopic}
          onGenerate={handleGenerate}
          loading={loading}
          canGenerate={canGenerate}
          hasApiKey={hasApiKey}
          onOpenHistory={() => setHistoryOpen(true)}
          onOpenFavorites={() => setFavoritesOpen(true)}
        />
        <main className="flex-1">
          <TopicGrid
            results={results}
            loading={loading}
            platform={platform}
            prompt={currentPrompt}
            favoritedIds={favoritedIds}
            onFavoritedIdsChange={setFavoritedIds}
          />
        </main>
      </div>
      <HistoryDrawer open={historyOpen} onClose={() => setHistoryOpen(false)} />
      <FavoritesDrawer
        open={favoritesOpen}
        onClose={() => setFavoritesOpen(false)}
        favoritedIds={favoritedIds}
        onFavoritedIdsChange={setFavoritedIds}
      />
      <Toaster
        position="top-center"
        toastOptions={{
          style: { background: '#1a1a1a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' },
        }}
      />
    </div>
  );
}
