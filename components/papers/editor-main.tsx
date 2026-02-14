'use client';

import { DesktopToolbar } from '@/components/papers/desktop-toolbar';
import { EditorPaper } from '@/components/papers/editor-paper';
import { api } from '@/convex/_generated/api';
import { Preloaded } from 'convex/react';
import { useEditor } from '@/hooks/use-editor';
import { MobileToolbar } from './mobile-toolbar';

interface EditorMainProps {
  preloadedPaper: Preloaded<typeof api.papers.getById>;
}

export function EditorMain({ preloadedPaper }: EditorMainProps) {
  const { paper } = useEditor(preloadedPaper);

  if (!paper) return <div>Paper not found</div>;

  return (
    <main className="w-full flex flex-col gap-3">
      <DesktopToolbar
        paper={paper}
        className="hidden xl:flex"
      />
      <MobileToolbar
        paper={paper}
        className="xl:hidden"
      />
      <EditorPaper paperId={paper._id} />
    </main>
  );
}
