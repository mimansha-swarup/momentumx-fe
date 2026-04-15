import { useState } from 'react';
import { Loader2, Search, Tag } from 'lucide-react';
import GlassCard from '@/components/shared/glassCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { IKeywordResult } from '@/types/feature/research';

interface KeywordsTabProps {
  results: IKeywordResult[];
  isLoading: boolean;
  error: string | null;
  onSearch: (query: string) => void;
}

const MIN_QUERY_LENGTH = 2;

const KeywordResultCard: React.FC<{ result: IKeywordResult }> = ({ result }) => (
  <GlassCard className="flex items-start gap-3 p-3">
    <Tag className="h-4 w-4 shrink-0 mt-0.5 text-primary" aria-hidden="true" />
    <div className="min-w-0 flex-1">
      <p className="text-sm text-foreground/90 line-clamp-2">{result.title}</p>
      <p className="mt-0.5 text-xs text-muted-foreground truncate">{result.channelTitle}</p>
    </div>
  </GlassCard>
);

const KeywordSkeletonCard: React.FC = () => (
  <GlassCard className="flex items-start gap-3 p-3">
    <Skeleton className="h-4 w-4 rounded shrink-0 mt-0.5" />
    <div className="flex-1 space-y-1.5">
      <Skeleton className="h-3 w-full rounded" />
      <Skeleton className="h-3 w-2/3 rounded" />
    </div>
  </GlassCard>
);

export const KeywordsTab: React.FC<KeywordsTabProps> = ({
  results,
  isLoading,
  error,
  onSearch,
}) => {
  const [query, setQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const canSearch = query.trim().length >= MIN_QUERY_LENGTH;

  const handleSubmit = () => {
    if (!canSearch) return;
    setHasSearched(true);
    onSearch(query.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <section aria-label="Keyword search">
      <div className="space-y-6">
        {/* Search input */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <label htmlFor="keyword-search" className="sr-only">
              Search keywords
            </label>
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="keyword-search"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search for keywords..."
              className={cn(
                'w-full pl-9 pr-4 py-2 text-sm',
                'bg-white/5 border border-white/10 rounded-lg',
                'text-foreground placeholder:text-muted-foreground',
                'transition-colors duration-200',
                'hover:border-white/20',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent',
              )}
              aria-label="Keyword search input"
            />
          </div>
          <Button
            onClick={handleSubmit}
            disabled={!canSearch || isLoading}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 transition-all duration-200 hover:shadow-purple-500/25 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-ring"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Search className="h-4 w-4" aria-hidden="true" />
            )}
            <span className="sr-only">Search</span>
          </Button>
        </div>

        {/* Results area */}
        {isLoading && (
          <div aria-busy="true" aria-label="Loading keyword results">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <KeywordSkeletonCard key={i} />
              ))}
            </div>
          </div>
        )}

        {!isLoading && error && (
          <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-4">
            <Search className="h-4 w-4 shrink-0 text-destructive" aria-hidden="true" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {!isLoading && !error && hasSearched && results.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
            <Tag className="h-8 w-8 text-muted-foreground/50" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">No results found for that keyword</p>
          </div>
        )}

        {!isLoading && !error && !hasSearched && (
          <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
            <Search className="h-8 w-8 text-muted-foreground/50" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">
              Enter a keyword to search for related content
            </p>
          </div>
        )}

        {!isLoading && !error && results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {results.map((result, i) => (
              <KeywordResultCard key={`${result.title}-${i}`} result={result} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
