import { TrashIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Suggestions } from '@/components/ui/suggestion';
import { MediaDisplay } from '@/components/media-display';

interface AttachedFilesProps {
  files: File[];
  setFiles: (files: File[]) => void;
}

export function AttachedFiles({ files, setFiles }: AttachedFilesProps) {
  return (
    <Suggestions className="gap-3 max-w-120 lg:max-w-none">
      {files.map((file, index) => (
        <div
          key={index}
          className="flex gap-1"
        >
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => setFiles(files.filter((_, i) => i !== index))}
          >
            <TrashIcon />
          </Button>
          <MediaDisplay
            type={file.type}
            src={URL.createObjectURL(file)}
          >
            {file.name}
          </MediaDisplay>
        </div>
      ))}
    </Suggestions>
  );
}
