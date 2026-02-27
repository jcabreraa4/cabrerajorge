'use client';

import { useState, ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Expand, Eye, HeadphonesIcon, Play, XIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface MediaDisplayProps {
  src: string;
  animation?: 'from-center' | 'top-to-bottom' | 'left-to-right';
  thumbnailSrc?: string;
  thumbnailAlt?: string;
  className?: string;
  type: string;
  size?: 'default' | 'icon';
  children?: ReactNode;
}

const animationVariants = {
  'from-center': {
    initial: { scale: 0.5, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.5, opacity: 0 }
  },
  'top-to-bottom': {
    initial: { y: '-100%', opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: '100%', opacity: 0 }
  },
  'left-to-right': {
    initial: { x: '-100%', opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: '100%', opacity: 0 }
  }
};

const imageTypes = ['image'];
const videoTypes = ['video'];
const audioTypes = ['audio'];

export function MediaDisplay({ animation = 'top-to-bottom', className, src, type, children, ...props }: MediaDisplayProps) {
  const selectedAnimation = animationVariants[animation];
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const isImage = imageTypes.some((imageType) => type.includes(imageType));
  const isVideo = videoTypes.some((videoType) => type.includes(videoType));
  const isAudio = audioTypes.some((audioType) => type.includes(audioType));

  return (
    <div className={cn('relative', className)}>
      <Button
        variant="outline"
        className="cursor-pointer"
        onClick={() => src && setIsVideoOpen(true)}
        {...props}
      >
        {isImage ? <Expand /> : isVideo ? <Play /> : isAudio ? <HeadphonesIcon /> : <Eye />}
        {children}
      </Button>
      <AnimatePresence>
        {isVideoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setIsVideoOpen(false)}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md"
          >
            <motion.div
              {...selectedAnimation}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative mx-4 md:mx-0 max-w-[86vw] max-h-[80vh]"
            >
              <motion.button
                onClick={() => setIsVideoOpen(false)}
                className="absolute -top-16 right-0 rounded-full bg-neutral-900/50 p-2 text-xl text-white ring-1 backdrop-blur-md dark:bg-neutral-100/50 dark:text-black cursor-pointer"
              >
                <XIcon className="size-5" />
              </motion.button>
              <div className="relative isolate z-1 overflow-hidden rounded-2xl border-2 border-white w-fit h-fit max-w-[86vw] max-h-[80vh]">
                {isImage ? (
                  <div className="bg-gray-100 rounded-md overflow-hidden relative">
                    <Image
                      width={1600}
                      height={900}
                      src={src}
                      alt="Image"
                      className="w-auto h-auto max-w-[86vw] max-h-[80vh] object-contain"
                    />
                  </div>
                ) : isVideo ? (
                  <video
                    controls
                    src={src}
                    className="w-auto h-auto max-w-[86vw] max-h-[80vh] rounded-2xl"
                  />
                ) : isAudio ? (
                  <div className="w-[min(86vw,560px)] rounded-2xl border border-white/20 bg-zinc-950/95 p-6 sm:p-8">
                    <div className="mb-5 flex items-center gap-3 text-white">
                      <div className="flex size-10 items-center justify-center rounded-full bg-white/10">
                        <HeadphonesIcon className="size-5" />
                      </div>
                      <p className="text-base font-semibold">Audio File</p>
                    </div>
                    <audio
                      controls
                      src={src}
                      className="w-full"
                    />
                  </div>
                ) : (
                  <iframe
                    src={src}
                    className="aspect-video w-[86vw] max-w-480 max-h-[80vh]"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
