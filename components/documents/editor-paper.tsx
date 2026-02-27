'use client';

import { StarterKit } from '@tiptap/starter-kit';
import { useEditor, EditorContent } from '@tiptap/react';
import { BulletList, TaskItem, TaskList } from '@tiptap/extension-list';
import { TableKit } from '@tiptap/extension-table';
import { ImageResize } from 'tiptap-extension-resize-image';
import { TextStyleKit } from '@tiptap/extension-text-style';
import { Highlight } from '@tiptap/extension-highlight';
import { Link } from '@tiptap/extension-link';
import { TextAlign } from '@tiptap/extension-text-align';
import { useEditorStore } from '@/store/editor-store';
import { useTiptapSync } from '@convex-dev/prosemirror-sync/tiptap';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export function EditorPaper({ paperId }: { paperId: Id<'documents'> }) {
  const { setEditor } = useEditorStore();
  const sync = useTiptapSync(api.prosemirror, paperId);

  useEffect(() => {
    if (sync.isLoading || sync.initialContent !== null || !sync.create) return;
    void sync.create({ type: 'doc', content: [] });
  }, [sync.isLoading, sync.initialContent, sync.create]);

  const editor = useEditor(
    {
      content: sync.initialContent ?? undefined,
      onCreate({ editor }) {
        setEditor(editor);
      },
      onDestroy() {
        setEditor(null);
      },
      onUpdate({ editor }) {
        setEditor(editor);
      },
      onSelectionUpdate({ editor }) {
        setEditor(editor);
      },
      onTransaction({ editor }) {
        setEditor(editor);
      },
      onFocus({ editor }) {
        setEditor(editor);
      },
      onBlur({ editor }) {
        setEditor(editor);
      },
      onContentError({ editor }) {
        setEditor(editor);
      },
      editorProps: {
        attributes: {
          class: 'focus:outline-none bg-white rounded-md xl:border border-[#C7C7C7] min-h-[1054px] xl:px-[56px] xl:pt-10 xl:pb-10'
        }
      },
      extensions: [
        StarterKit.configure({
          link: false
        }),
        TextStyleKit,
        ImageResize,
        BulletList,
        TaskList,
        TaskItem.configure({
          nested: true
        }),
        TableKit.configure({
          table: { resizable: true }
        }),
        Highlight.configure({
          multicolor: true
        }),
        Link.configure({
          openOnClick: false,
          autolink: true,
          defaultProtocol: 'https'
        }),
        TextAlign.configure({
          types: ['heading', 'paragraph'],
          alignments: ['left', 'center', 'right', 'justify']
        }),
        ...(sync.extension ? [sync.extension] : [])
      ],
      immediatelyRender: false,
      editable: !sync.isLoading && sync.initialContent !== null
    },
    [paperId, sync.extension, sync.initialContent]
  );

  if (sync.isLoading || sync.initialContent === null || !sync.extension) {
    return (
      <div className="w-full flex-1 overflow-y-scroll">
        <div className="rounded-lg w-full max-w-204 mx-auto my-4 px-4 md:px-0 bg-white min-h-[70vh] border border-[#C7C7C7] flex items-center justify-center">
          <Loader2 className="animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex-1 overflow-y-scroll">
      <div className="rounded-lg w-full max-w-204 mx-auto py-2 lg:py-0 lg:my-4 px-2 lg:px-0 bg-white">
        <EditorContent
          editor={editor}
          className="w-full dark:text-black"
        />
      </div>
    </div>
  );
}
