import { mediaType } from '@/utils/media-type';
import { sizeToText } from '@/utils/size-to-text';
import { FileTextIcon, HeadphonesIcon, ImageIcon, VideoIcon } from 'lucide-react';

interface MediaInfoProps {
  name: string;
  size: number;
  type: string;
}

export function MediaInfo({ name, size, type }: MediaInfoProps) {
  const fileType = mediaType(type);

  return (
    <section className="h-13 overflow-hidden flex flex-col gap-1">
      <div className="flex items-center">
        <div className="min-w-8">{fileType === 'image' ? <ImageIcon /> : fileType === 'video' ? <VideoIcon /> : fileType === 'audio' ? <HeadphonesIcon /> : <FileTextIcon />}</div>
        <p className="font-semibold text-lg truncate">{name}</p>
      </div>
      <p className="text-sm text-gray-500">{sizeToText(size)}</p>
    </section>
  );
}
