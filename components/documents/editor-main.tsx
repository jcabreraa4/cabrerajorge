'use client';

import dynamic from 'next/dynamic';
import { DesktopToolbar } from '@/components/documents/desktop-toolbar';
import { api } from '@/convex/_generated/api';
import { Preloaded } from 'convex/react';
import { useEditor } from '@/hooks/use-editor';
import { MobileToolbar } from './mobile-toolbar';
import { Button } from '../ui/button';
import { FileTextIcon } from 'lucide-react';
import Link from 'next/link';

const EditorPaper = dynamic(() => import('@/components/documents/editor-paper').then((m) => ({ default: m.EditorPaper })), { ssr: false });

export function EditorMain({ preloadedDocument }: { preloadedDocument: Preloaded<typeof api.documents.getById> }) {
  const { document } = useEditor(preloadedDocument);

  if (!document)
    return (
      <section className="w-full flex flex-col justify-center items-center gap-5">
        <div className="flex flex-col gap-3 items-center">
          <p className="text-xl font-semibold">404 Not Found</p>
          <p>The document you are looking for could not be found.</p>
        </div>
        <Link href="/documents">
          <Button className="cursor-pointer">
            <FileTextIcon />
            Check Documents
          </Button>
        </Link>
      </section>
    );

  return (
    <section className="w-full flex flex-col gap-3">
      <DesktopToolbar
        document={document}
        className="hidden xl:flex"
      />
      <MobileToolbar
        document={document}
        className="xl:hidden"
      />
      <EditorPaper paperId={document._id} />
    </section>
  );
}
