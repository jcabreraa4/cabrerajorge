import { api } from '@/convex/_generated/api';
import { Preloaded, usePreloadedQuery } from 'convex/react';

export function useEditor(preloadedDocument: Preloaded<typeof api.documents.getById>) {
  const document = usePreloadedQuery(preloadedDocument);

  return { document };
}
