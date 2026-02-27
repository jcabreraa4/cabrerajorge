'use client';

import Link from 'next/link';
import { Preloaded, usePreloadedQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Button } from '@/components/ui/button';
import { mediaType } from '@/utils/media-type';
import { FileTextIcon } from 'lucide-react';
import { AudioRender, ImageRender, OtherRender, VideoRender } from './media-render';
import { MediaInfo } from './media-info';

export function MediaPage({ preloaded }: { preloaded: Preloaded<typeof api.multimedia.getById> }) {
  const file = usePreloadedQuery(preloaded);

  if (!file)
    return (
      <main className="w-full flex flex-col justify-center items-center gap-5">
        <div className="flex flex-col gap-3 items-center">
          <p className="text-xl font-semibold">404 Not Found</p>
          <p>The file you are looking for could not be found.</p>
        </div>
        <Link href="/multimedia">
          <Button className="cursor-pointer">
            <FileTextIcon />
            Check Multimedia
          </Button>
        </Link>
      </main>
    );

  const type = mediaType(file.type);

  return (
    <main className="flex flex-col max-w-5xl w-full mx-auto gap-6 justify-center pb-20">
      <section className="aspect-video rounded-md overflow-hidden relative border border-black bg-black">
        {type === 'image' ? (
          <ImageRender
            src={file.url}
            alt={file.name}
          />
        ) : type === 'video' ? (
          <VideoRender
            interact
            src={file.url}
          />
        ) : type === 'audio' ? (
          <AudioRender
            interact
            src={file.url}
          />
        ) : (
          <OtherRender
            interact
            src={file.url}
          />
        )}
      </section>
      <MediaInfo
        name={file.name}
        size={file.size}
        type={file.type}
      />
    </main>
  );
}
