'use client';

import { useMutation } from 'convex/react';
import { Plus, Trash, UploadCloud } from 'lucide-react';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { api } from '@/convex/_generated/api';
import { cn } from '@/lib/utils';
import { sizeToText } from '@/utils/size-to-text';
import { MediaPreview } from '@/components/multimedia/media-preview';
import { ButtonVariant } from '@/types/shadcn';

const validTypes = ['image', 'video', 'pdf', 'audio'];

interface UploadDialogProps {
  variant?: ButtonVariant;
  className?: string;
}

export function UploadDialog({ variant = 'default', className }: UploadDialogProps) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateUrl = useMutation(api.multimedia.generateUrl);
  const fileUpload = useMutation(api.multimedia.create);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxFiles: 1,
    disabled: isLoading,
    onDrop: (files) => {
      const selectedFile = files[0];
      if (!selectedFile) return;
      setFile(selectedFile);
    }
  });

  function resetDialog() {
    setOpen(false);
    setFile(null);
  }

  async function uploadFile() {
    if (!file) return;
    const contentType = file.type || 'application/octet-stream';
    setIsLoading(true);
    try {
      const postUrl = await generateUrl();
      const result = await fetch(postUrl, {
        method: 'POST',
        headers: { 'Content-Type': contentType },
        body: file
      });
      const { storageId } = await result.json();
      if (!result.ok || !storageId) throw new Error('Upload failed.');
      await fileUpload({
        name: file.name,
        type: contentType,
        size: file.size,
        storage: storageId
      });
      toast.success('File uploaded successfully.');
      resetDialog();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not upload file.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen && !isLoading) {
          setFile(null);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant={variant}
          className={cn('cursor-pointer', className)}
        >
          <Plus />
          Upload File
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload File</DialogTitle>
          <DialogDescription className="lg:hidden">Images, videos, audios or pdfs.</DialogDescription>
          <DialogDescription className="hidden lg:block">Upload images, videos, audios or pdfs.</DialogDescription>
        </DialogHeader>
        {file ? (
          <div className="space-y-4">
            <MediaPreview
              src={URL.createObjectURL(file)}
              type={file.type || 'application/octet-stream'}
              interact={!isLoading}
            />
            <div className="h-13 overflow-hidden flex flex-col gap-1">
              <p className="font-semibold text-lg truncate">{file.name}</p>
              <p className="text-sm text-gray-500">{sizeToText(file.size)}</p>
            </div>
          </div>
        ) : (
          <div
            {...getRootProps({ role: 'button', tabIndex: 0 })}
            className={`flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed p-6 text-center cursor-pointer ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300'}`}
          >
            <input
              {...getInputProps()}
              className="hidden"
              multiple={false}
            />
            <UploadCloud className="h-6 w-6 text-gray-500 dark:text-white/90" />
            <p className="text-sm text-gray-600 dark:text-white/90">Drag and drop, or click to select a file</p>
          </div>
        )}
        {file && (
          <DialogFooter>
            {isLoading ? (
              <Button
                variant="outline"
                className="w-full animate-pulse hover:bg-inherit"
              >
                Uploading...
              </Button>
            ) : (
              <div className="flex flex-col gap-3 w-full">
                {validTypes.some((validType) => file?.type.includes(validType)) && (
                  <Button
                    onClick={uploadFile}
                    className="w-full cursor-pointer"
                  >
                    <Plus />
                    Upload File
                  </Button>
                )}
                <Button
                  onClick={() => setFile(null)}
                  className="w-full cursor-pointer"
                >
                  <Trash />
                  Delete File
                </Button>
              </div>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
