import { Button } from '@/components/ui/button';
import { BoldIcon, ItalicIcon, PrinterIcon, Redo2Icon, RemoveFormattingIcon, UnderlineIcon, Undo2Icon, DownloadIcon, FileBracesCorner, FileCodeCorner, FilePenIcon, FileTextIcon, GlobeIcon, StrikethroughIcon, TextIcon, TrashIcon } from 'lucide-react';
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarSub, MenubarSubContent, MenubarSubTrigger, MenubarTrigger } from '@/components/ui/menubar';
import { useEditorStore } from '@/store/editor-store';
import { Paper } from '@/convex/schema';
import { UpdateDialog } from './update-dialog';
import { RemoveDialog } from './remove-dialog';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface MobileToolbarProps {
  paper: Paper;
  className?: string;
}

export function MobileToolbar({ paper, className }: MobileToolbarProps) {
  const { editor } = useEditorStore();

  function insertTable({ rows, cols }: { rows: number; cols: number }) {
    editor?.chain().focus().insertTable({ rows, cols, withHeaderRow: false }).run();
  }

  function onDownload(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    toast.success('Paper ready to be downloaded.');
  }

  function onSaveJSON() {
    if (!editor) return;
    const content = editor.getJSON();
    const blob = new Blob([JSON.stringify(content)], { type: 'application/json' });
    onDownload(blob, `${paper.title}.json`);
  }

  function onSaveHTML() {
    if (!editor) return;
    const content = editor.getHTML();
    const blob = new Blob([content], { type: 'text/html' });
    onDownload(blob, `${paper.title}.html`);
  }

  function onSaveText() {
    if (!editor) return;
    const content = editor.getText();
    const blob = new Blob([content], { type: 'text/plain' });
    onDownload(blob, `${paper.title}.txt`);
  }

  return (
    <Menubar className={cn('border-none bg-transparent shadow-none h-auto p-0 print:hidden', className)}>
      <MenubarMenu>
        <MenubarTrigger asChild>
          <Button
            variant="ghost"
            className="cursor-pointer dark:hover:bg-secondary"
          >
            File
          </Button>
        </MenubarTrigger>
        <MenubarContent className="print:hidden">
          <MenubarSub>
            <MenubarSubTrigger>
              <DownloadIcon className="size-4 mr-2" />
              Download
            </MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem onClick={() => window.print()}>
                <GlobeIcon className="size-4 mr-2" />
                PDF
              </MenubarItem>
              <MenubarItem onClick={onSaveJSON}>
                <FileBracesCorner className="size-4 mr-2" />
                JSON
              </MenubarItem>
              <MenubarItem onClick={onSaveHTML}>
                <FileCodeCorner className="size-4 mr-2" />
                HTML
              </MenubarItem>
              <MenubarItem onClick={onSaveText}>
                <FileTextIcon className="size-4 mr-2" />
                TXT
              </MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <UpdateDialog
            id={paper._id}
            title={paper.title}
          >
            <MenubarItem onSelect={(e) => e.preventDefault()}>
              <FilePenIcon className="size-4 mr-2" />
              Rename
            </MenubarItem>
          </UpdateDialog>
          <RemoveDialog
            redirect
            id={paper._id}
          >
            <MenubarItem onSelect={(e) => e.preventDefault()}>
              <TrashIcon className="size-4 mr-2" />
              Remove
            </MenubarItem>
          </RemoveDialog>
          <MenubarSeparator />
          <MenubarItem onClick={() => window.print()}>
            <PrinterIcon className="size-4 mr-2" />
            Print <MenubarShortcut>Ctrl+P</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger asChild>
          <Button
            variant="ghost"
            className="cursor-pointer dark:hover:bg-secondary"
          >
            Edit
          </Button>
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={() => editor?.chain().focus().undo().run()}>
            <Undo2Icon className="size-4 mr-2" />
            Undo <MenubarShortcut>Ctrl+Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem onClick={() => editor?.chain().focus().redo().run()}>
            <Redo2Icon className="size-4 mr-2" />
            Redo <MenubarShortcut>Ctrl+Y</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger asChild>
          <Button
            variant="ghost"
            className="cursor-pointer dark:hover:bg-secondary"
          >
            Insert
          </Button>
        </MenubarTrigger>
        <MenubarContent>
          <MenubarSub>
            <MenubarSubTrigger>Table</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem onClick={() => insertTable({ rows: 1, cols: 1 })}>1 x 1</MenubarItem>
              <MenubarItem onClick={() => insertTable({ rows: 2, cols: 2 })}>2 x 2</MenubarItem>
              <MenubarItem onClick={() => insertTable({ rows: 3, cols: 3 })}>3 x 3</MenubarItem>
              <MenubarItem onClick={() => insertTable({ rows: 4, cols: 4 })}>4 x 4</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger asChild>
          <Button
            variant="ghost"
            className="cursor-pointer dark:hover:bg-secondary"
          >
            Format
          </Button>
        </MenubarTrigger>
        <MenubarContent>
          <MenubarSub>
            <MenubarSubTrigger>
              <TextIcon className="size-4 mr-2" />
              Text
            </MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem onClick={() => editor?.chain().focus().toggleBold().run()}>
                <BoldIcon className="size-4 mr-2" />
                Bold <MenubarShortcut>Ctrl+B</MenubarShortcut>
              </MenubarItem>
              <MenubarItem onClick={() => editor?.chain().focus().toggleItalic().run()}>
                <ItalicIcon className="size-4 mr-2" />
                Italic <MenubarShortcut>Ctrl+I</MenubarShortcut>
              </MenubarItem>
              <MenubarItem onClick={() => editor?.chain().focus().toggleUnderline().run()}>
                <UnderlineIcon className="size-4 mr-2" />
                Underline <MenubarShortcut>Ctrl+U</MenubarShortcut>
              </MenubarItem>
              <MenubarItem onClick={() => editor?.chain().focus().toggleStrike().run()}>
                <StrikethroughIcon className="size-4 mr-2" />
                Strike <MenubarShortcut>Ctrl+S</MenubarShortcut>
              </MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarItem onClick={() => editor?.chain().focus().unsetAllMarks().run()}>
            <RemoveFormattingIcon className="size-4 mr-2" />
            Clear Formatting
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
