import { useState } from 'react';
import Image from 'next/image';
import { HeadphonesIcon, Loader2Icon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function RenderLoader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
      <Loader2Icon className="size-12 animate-spin text-black" />
    </div>
  );
}

interface ImageRenderProps {
  src: string;
  alt: string;
  className?: string;
}

export function ImageRender({ src, alt, className }: ImageRenderProps) {
  return (
    <Image
      fill
      src={src}
      alt={alt}
      className={cn('pointer-events-none', className)}
    />
  );
}

interface VideoRenderProps {
  src: string;
  interact?: boolean;
  className?: string;
}

export function VideoRender({ src, interact = false, className }: VideoRenderProps) {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <RenderLoader />}
      <video
        controls={interact}
        src={src}
        className={cn('object-cover', className)}
        onLoadedData={() => setLoading(false)}
      />
    </>
  );
}

interface AudioRenderProps {
  src: string;
  interact?: boolean;
  className?: string;
}

export function AudioRender({ src, interact = false, className }: AudioRenderProps) {
  const [loading, setLoading] = useState(true);

  if (interact)
    return (
      <>
        {loading && <RenderLoader />}
        <div className="aspect-video bg-gray-100 dark:bg-gray-100 rounded-md flex flex-col items-center justify-center gap-2 dark:text-black">
          <div className="flex gap-2 flex-1 items-center pt-5">
            <HeadphonesIcon className="size-6 lg:size-8" />
            <p className="text-lg lg:text-2xl font-semibold">Audio File</p>
          </div>
          <div className="w-full px-2">
            <audio
              controls
              src={src}
              className={cn('w-full', className)}
              onLoadedData={() => setLoading(false)}
            />
          </div>
        </div>
      </>
    );

  return (
    <div className="aspect-video bg-gray-100 dark:bg-gray-100 rounded-md flex items-center justify-center gap-2 dark:text-black">
      <HeadphonesIcon className="size-6 lg:size-8" />
      <p className="text-lg lg:text-2xl font-semibold">Audio File</p>
    </div>
  );
}

interface OtherRenderProps {
  src: string;
  interact?: boolean;
  className?: string;
}

export function OtherRender({ src, interact = false, className }: OtherRenderProps) {
  const [loading, setLoading] = useState(true);

  if (interact)
    return (
      <>
        {loading && <RenderLoader />}
        <iframe
          src={`${src}#view=FitH&toolbar=0&navpanes=0&scrollbar=0&zoom=150`}
          className={cn('absolute h-full w-full border-0 scroll-hidden', className)}
          onLoad={() => setLoading(false)}
        />
      </>
    );

  return (
    <>
      {loading && <RenderLoader />}
      <Document
        file={src}
        onLoadSuccess={() => setLoading(false)}
        onLoadError={() => setLoading(false)}
      >
        <Page
          pageNumber={1}
          width={400}
          renderAnnotationLayer={false}
          renderTextLayer={false}
        />
      </Document>
    </>
  );
}
