import { PlusIcon, TrashIcon, UploadCloudIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ButtonVariant } from '@/types/shadcn';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { sizeToText } from '@/utils/size-to-text';
import { MediaPreview } from '@/components/multimedia/media-preview';
import { toast } from 'sonner';
import { useDropzone } from 'react-dropzone';
import { processFile } from '@/actions/generate-embeddings';

interface VectorizeDialogProps {
  variant?: ButtonVariant;
  className?: string;
}

const validTypes = ['pdf'];

export function VectorizeDialog({ variant = 'default', className }: VectorizeDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxFiles: 1,
    onDrop: (files) => {
      const f = files[0];
      setFile(f);
    }
  });

  async function vectorizeFile() {
    if (!file) {
      toast.error('There is no file to be processed.');
      return;
    }
    setIsLoading(true);
    const toastLoader = toast.loading('Converting the file to AI embeddings...');
    const response = await processFile(file);
    if (!response?.success) toast.error('There was an error converting the file.', { id: toastLoader });
    else {
      toast.success('File converted to embeddings successfully.', { id: toastLoader });
      setFile(null);
    }
    setIsLoading(false);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={variant}
          className={cn('cursor-pointer', className)}
        >
          <PlusIcon />
          Process File
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Process File</DialogTitle>
          <DialogDescription>This will serve as knowledge for your AI assistant.</DialogDescription>
        </DialogHeader>
        {file ? (
          <div className="space-y-4">
            <MediaPreview
              src={URL.createObjectURL(file)}
              type={file.type}
              interact={true}
            />
            <div className="h-13 overflow-hidden flex flex-col gap-1">
              <p className="font-semibold text-lg truncate">{file?.name}</p>
              <p className="text-sm text-gray-500">{sizeToText(file?.size)}</p>
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
            <UploadCloudIcon className="h-6 w-6 text-gray-500 dark:text-white/90" />
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
                Processing...
              </Button>
            ) : (
              <div className="flex flex-col gap-3 w-full">
                {validTypes.some((validType) => file?.type.includes(validType)) && (
                  <DialogClose asChild>
                    <Button
                      className="w-full cursor-pointer"
                      onClick={vectorizeFile}
                    >
                      <PlusIcon />
                      Process File
                    </Button>
                  </DialogClose>
                )}
                <Button
                  className="w-full cursor-pointer"
                  onClick={() => setFile(null)}
                >
                  <TrashIcon />
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
