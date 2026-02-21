'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Ban, HeadphonesIcon, Loader2 } from 'lucide-react';
import { useDevice } from '@/hooks/use-device';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface MediaPreviewProps {
  src: string;
  type: string;
  interact: true | false;
}

const fileTypes = {
  image: ['image'],
  video: ['video'],
  audio: ['audio'],
  other: ['pdf']
};

export function MediaPreview({ src, type, interact }: MediaPreviewProps) {
  const device = useDevice();
  const [loading, setLoading] = useState(true);

  const isImage = fileTypes.image.some((imageType) => type.includes(imageType));
  const isVideo = fileTypes.video.some((videoType) => type.includes(videoType));
  const isAudio = fileTypes.audio.some((audioType) => type.includes(audioType));
  const isOther = fileTypes.other.some((otherType) => type.includes(otherType));

  useEffect(() => {
    if (isAudio || (!isImage && !isOther && !isVideo)) {
      setLoading(false);
    }
  }, [isAudio, isImage, isVideo, isOther]);

  return (
    <div className="aspect-video rounded-md overflow-hidden relative border border-black bg-black">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
          <Loader2 className="size-12 animate-spin text-black" />
        </div>
      )}
      {isImage ? (
        <Image
          fill
          src={src}
          alt="Image"
          className="object-cover lg:pointer-events-none"
          onLoad={() => setLoading(false)}
        />
      ) : isVideo ? (
        <video
          controls={interact || device !== 'computer'}
          src={src}
          className="object-cover"
          onLoadedData={() => setLoading(false)}
        />
      ) : isAudio ? (
        interact || device !== 'computer' ? (
          <div
            onLoad={() => setLoading(false)}
            className="aspect-video bg-gray-100 dark:bg-gray-100 rounded-md flex flex-col items-center justify-center gap-2 dark:text-black"
          >
            <div className="flex gap-2 flex-1 items-center pt-5">
              <HeadphonesIcon className="size-6 lg:size-8" />
              <p className="text-lg lg:text-2xl font-semibold">Audio File</p>
            </div>
            <div className="w-full px-2">
              <audio
                controls
                src={src}
                className="w-full"
              />
            </div>
          </div>
        ) : (
          <div
            onLoad={() => setLoading(false)}
            className="aspect-video bg-gray-100 dark:bg-gray-100 rounded-md flex items-center justify-center gap-2 dark:text-black"
          >
            <HeadphonesIcon className="size-6 lg:size-8" />
            <p className="text-lg lg:text-2xl font-semibold">Audio File</p>
          </div>
        )
      ) : isOther ? (
        interact || device !== 'computer' ? (
          <iframe
            src={`${src}#view=FitH&toolbar=0&navpanes=0&scrollbar=0&zoom=150`}
            className="absolute h-full w-full border-0 scroll-hidden"
            onLoad={() => setLoading(false)}
          />
        ) : (
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
        )
      ) : (
        <div className="aspect-video bg-gray-100 dark:bg-gray-100 rounded-md flex items-center justify-center gap-2 dark:text-black">
          <Ban className="size-6 lg:size-8" />
          <p className="text-lg lg:text-2xl font-semibold">Type not Allowed</p>
        </div>
      )}
    </div>
  );
}
