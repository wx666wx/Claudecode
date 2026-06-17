import { Skeleton } from '@/components/ui/skeleton';
import EmptyState from './EmptyState';
import TopicCard from './TopicCard';
import type { TopicResult, Platform } from '@/types';

interface Props {
  results: TopicResult[] | null;
  loading: boolean;
  platform: Platform | null;
  prompt: string;
  favoritedIds: Map<string, number>;
  onFavoritedIdsChange: (ids: Map<string, number>) => void;
}

export default function TopicGrid({ results, loading, platform, prompt, favoritedIds, onFavoritedIdsChange }: Props) {
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-44 w-full" />
        ))}
      </div>
    );
  }

  if (!results) {
    return <EmptyState platform={platform} />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {results.map((topic, i) => (
        <TopicCard
          key={topic.title}
          topic={topic}
          index={i}
          platform={platform!}
          prompt={prompt}
          isFavorited={favoritedIds.has(topic.title)}
          favoriteId={favoritedIds.get(topic.title)}
          onFavoritedChange={(title, now, id) => {
            const next = new Map(favoritedIds);
            if (now && id) next.set(title, id);
            else next.delete(title);
            onFavoritedIdsChange(next);
          }}
        />
      ))}
    </div>
  );
}
