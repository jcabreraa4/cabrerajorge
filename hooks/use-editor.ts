import { api } from '@/convex/_generated/api';
import { Preloaded, usePreloadedQuery } from 'convex/react';

export function useEditor(preloadedPaper: Preloaded<typeof api.papers.getById>) {
  const paper = usePreloadedQuery(preloadedPaper);

  return { paper };
}
