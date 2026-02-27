'use client';

import { useState } from 'react';
import { Copy, Download, ExpandIcon, LucideIcon, PenIcon, SaveIcon, Star, TrashIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { useIsMobile } from '@/hooks/use-mobile';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { MediaFile } from '@/convex/schema';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';

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
  const [info, setInfo] = useState({ name: file.name, note: file.note });

  const deleteFile = useMutation(api.multimedia.deleteById);
  const updateFile = useMutation(api.multimedia.updateById);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <SectionButton
          onClick={() => {}}
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
            value={info.name}
            onChange={(e) => setInfo({ ...info, name: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Note</Label>
          <Textarea
            id="name"
            value={info.note}
            className="h-20"
            onChange={(e) => setInfo({ ...info, note: e.target.value })}
          />
        </div>
        <DialogFooter>
          <Button
            className="flex-1 cursor-pointer"
            onClick={() =>
              updateFile({ id: file._id, name: info.name, note: info.note }).finally(() => {
                toast.success('File updated successfully.');
                setOpen(false);
              })
            }
          >
            <SaveIcon />
            Update File
          </Button>
          <Button
            className="flex-1 cursor-pointer"
            onClick={() =>
              deleteFile({ id: file._id }).finally(() => {
                toast.success('File deleted successfully.');
                setOpen(false);
              })
            }
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
  const router = useRouter();
  const updateFile = useMutation(api.multimedia.updateById);

  const sectionButtons = [
    {
      icon: Star,
      onClick: () => updateFile({ id: file._id, starred: !file.starred }).finally(() => toast.success(file.starred ? 'File removed from starred successfully.' : 'File added to starred successfully.')),
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
      <SectionButton
        icon={ExpandIcon}
        onClick={() => router.push(`/multimedia/${file._id}`)}
      />
    </div>
  );
}
