import { MediaPreview } from '@/components/multimedia/media-preview';
import { MediaFile } from '@/convex/schema';
import { useChatHelperStore } from '@/store/helper-store';
import { MediaToolbar } from '@/components/multimedia/media-toolbar';
import { MediaInfo } from '@/components/multimedia/media-info';
import { cn } from '@/lib/utils';

type UrlMediaFile = MediaFile & { url: string | null };

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
                id={file._id}
                src={file.url!}
                name={file.name}
                type={file.type}
              />
              <MediaInfo
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
                id={file._id}
                src={file.url!}
                name={file.name}
                type={file.type}
              />
              <MediaInfo
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
