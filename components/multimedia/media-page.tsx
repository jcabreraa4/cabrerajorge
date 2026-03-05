'use client';

import Link from 'next/link';
import { Preloaded, usePreloadedQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Button } from '@/components/ui/button';
import { mediaType } from '@/utils/media-type';
import { FileTextIcon } from 'lucide-react';
import { AudioRender, ImageRender, OtherRender, VideoRender } from './media-render';

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
    <main className="w-full flex flex-1 justify-center">
      <section className="flex flex-col gap-6 w-full px-3 md:px-5 max-w-5xl justify-center">
        {type === 'image' ? (
          <ImageRender
            src={file.url}
            alt={file.name}
            width={file.width}
            height={file.height}
            className="mx-auto border border-black h-full"
          />
        ) : type === 'video' ? (
          <div className="rounded-md overflow-hidden relative aspect-video border border-black bg-black">
            <VideoRender
              interact
              src={file.url}
            />
          </div>
        ) : type === 'audio' ? (
          <div className="rounded-md overflow-hidden relative aspect-video border border-black bg-black">
            <AudioRender
              interact
              src={file.url}
            />
          </div>
        ) : (
          <div className="rounded-md overflow-hidden relative h-[80vh] border border-black bg-black">
            <OtherRender
              interact
              src={file.url}
            />
          </div>
        )}
      </section>
    </main>
  );
}
