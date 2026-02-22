import { sizeToText } from '@/utils/size-to-text';
import { FileTextIcon, HeadphonesIcon, ImageIcon, VideoIcon } from 'lucide-react';
import { MediaPreview } from './media-preview';
import { MediaFile } from '@/convex/schema';
import { useChatHelperStore } from '@/store/helper-store';
import { cn } from '@/lib/utils';
import { MediaToolbar } from './media-toolbar';

interface MediaFileInfoProps {
  name: string;
  size: number;
  type: string;
}

type UrlMediaFile = MediaFile & { url: string | null };

function MediaFileInfo({ name, size, type }: MediaFileInfoProps) {
  return (
    <div className="h-13 overflow-hidden flex flex-col gap-1">
      <div className="flex items-center">
        <div className="min-w-8">{type.startsWith('image') ? <ImageIcon /> : type.startsWith('video') ? <VideoIcon /> : type.startsWith('audio') ? <HeadphonesIcon /> : <FileTextIcon />}</div>
        <p className="font-semibold text-lg truncate">{name}</p>
      </div>
      <p className="text-sm text-gray-500">{sizeToText(size)}</p>
    </div>
  );
}

export function MediaTable({ multimedia }: { multimedia: UrlMediaFile[] }) {
  const show = useChatHelperStore((state) => state.show);

  const starredFiles = multimedia.filter((file) => file.starred);
  const nonStarredFiles = multimedia!.filter((file) => !file.starred);

  return (
    <>
      {starredFiles.length != 0 && (
        <div className={cn('grid grid-flow-row gap-8 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3', show ? '2xl:grid-cols-3' : '2xl:grid-cols-4')}>
          {starredFiles.map((file) => (
            <div
              key={file._id}
              className="flex flex-col gap-5"
            >
              <MediaPreview
                src={file.url!}
                type={file.type}
                interact={false}
              />
              <MediaFileInfo
                name={file.name}
                size={file.size}
                type={file.type}
              />
              <MediaToolbar file={file} />
            </div>
          ))}
        </div>
      )}
      {nonStarredFiles.length != 0 && (
        <div className={cn('grid grid-flow-row gap-8 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3', show ? '2xl:grid-cols-3' : '2xl:grid-cols-4')}>
          {nonStarredFiles.map((file) => (
            <div
              key={file._id}
              className="flex flex-col gap-5"
            >
              <MediaPreview
                src={file.url!}
                type={file.type}
                interact={false}
              />
              <MediaFileInfo
                name={file.name}
                size={file.size}
                type={file.type}
              />
              <MediaToolbar file={file} />
            </div>
          ))}
        </div>
      )}
      <div className="py-0.5 lg:hidden" />
    </>
  );
}
