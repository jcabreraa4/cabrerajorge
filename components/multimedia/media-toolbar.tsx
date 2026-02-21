'use client';

import { useState } from 'react';
import { Copy, Download, LucideIcon, PenIcon, Save, SaveIcon, Star, Trash, TrashIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { useIsMobile } from '@/hooks/use-mobile';
import { MediaDisplay } from '@/components/media-display';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { MediaFile } from '@/convex/schema';

interface SectionButtonProps {
  onClick: () => void;
  icon: LucideIcon;
  isActive?: boolean;
}

type UrlMediaFile = MediaFile & { url: string | null };

function copyLink(link: string) {
  navigator.clipboard.writeText(link);
  toast.success('Link copied to clipboard successfully.');
}

async function mediaDownload(url: string, name: string) {
  const toastId = toast.loading('Preparing the download of the file...');
  try {
    const blob = await fetch(url).then((r) => r.blob());
    const link = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(blob),
      download: name || 'download'
    });
    link.click();
    URL.revokeObjectURL(link.href);
    toast.success('The file is ready to be downloaded.', { id: toastId });
  } catch (error) {
    console.error('Download error:', error);
    toast.error('An error occurred downloading the file.', { id: toastId });
  }
}

function SectionButton({ onClick, icon: Icon, isActive }: SectionButtonProps) {
  const isMobile = useIsMobile();

  return (
    <Button
      onClick={onClick}
      size={isMobile ? 'icon' : 'default'}
      variant={isActive ? 'default' : 'outline'}
      className="cursor-pointer"
    >
      <Icon className="size-4" />
    </Button>
  );
}

function UpdateDialog({ file }: { file: MediaFile }) {
  const [open, setOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>('');

  const deleteFile = useMutation(api.multimedia.deleteById);
  const updateFile = useMutation(api.multimedia.updateById);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <SectionButton
          onClick={() => setName(file.name)}
          icon={PenIcon}
        />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update File</DialogTitle>
          <DialogDescription>Change your file&apos;s information.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button
            className="flex-1 cursor-pointer"
            onClick={() => {
              updateFile({ id: file._id, name: name });
              setOpen(false);
            }}
          >
            <SaveIcon />
            Update File
          </Button>
          <Button
            className="flex-1 cursor-pointer"
            onClick={() => {
              deleteFile({ id: file._id });
              setOpen(false);
            }}
          >
            <TrashIcon />
            Delete File
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function MediaToolbar({ file }: { file: UrlMediaFile }) {
  const updateFile = useMutation(api.multimedia.updateById);

  const sectionButtons = [
    {
      icon: Star,
      onClick: () => updateFile({ id: file._id, starred: !file.starred }),
      isActive: file.starred
    },
    {
      icon: Copy,
      onClick: () => copyLink(file.url!)
    },
    {
      icon: Download,
      onClick: () => mediaDownload(file.url!, file.name)
    }
  ];

  return (
    <div className="flex gap-3">
      {sectionButtons.map((sectionButton, index) => (
        <SectionButton
          key={index}
          {...sectionButton}
        />
      ))}
      <UpdateDialog file={file} />
      <MediaDisplay
        src={file.url!}
        type={file.type}
        className="hidden lg:block"
      />
    </div>
  );
}
