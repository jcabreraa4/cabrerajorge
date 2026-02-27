'use client';

import { BanIcon } from 'lucide-react';
import { useDevice } from '@/hooks/use-device';
import { useRouter } from 'next/navigation';
import { mediaType } from '@/utils/media-type';
import { AudioRender, ImageRender, OtherRender, VideoRender } from './media-render';
import { cn } from '@/lib/utils';

interface MediaPreviewProps {
  id?: string;
  src: string;
  name?: string;
  type: string;
  interact?: boolean;
}

export function MediaPreview({ id, src, name, type, interact = false }: MediaPreviewProps) {
  const device = useDevice();
  const router = useRouter();

  const fileType = mediaType(type);

  return (
    <div
      className={cn('aspect-video rounded-md overflow-hidden relative border border-black bg-black', id && 'cursor-pointer')}
      onClick={() => id && router.push(`/multimedia/${id}`)}
    >
      {fileType === 'image' ? (
        <ImageRender
          src={src}
          alt={name || 'Image'}
          className="object-cover"
        />
      ) : fileType === 'video' ? (
        <VideoRender
          src={src}
          interact={interact || device !== 'computer'}
        />
      ) : fileType === 'audio' ? (
        <AudioRender
          src={src}
          interact={interact || device !== 'computer'}
        />
      ) : fileType === 'other' ? (
        <OtherRender
          src={src}
          interact={interact || device !== 'computer'}
        />
      ) : (
        <div className="aspect-video bg-gray-100 dark:bg-gray-100 rounded-md flex items-center justify-center gap-2 dark:text-black">
          <BanIcon className="size-6 lg:size-8" />
          <p className="text-lg lg:text-2xl font-semibold">Type not Allowed</p>
        </div>
      )}
    </div>
  );
}
