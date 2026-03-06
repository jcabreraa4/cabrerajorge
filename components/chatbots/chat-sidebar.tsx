'use client';

import { Button } from '@/components/ui/button';
import { useLocation } from '@/hooks/use-location';
import { cn } from '@/lib/utils';
import { type LucideIcon, BrainIcon, ImageIcon, MessageSquareIcon, PhoneCallIcon } from 'lucide-react';
import Link from 'next/link';

export type ChatSection = {
  url: string;
  icon: LucideIcon;
};

export const sections: ChatSection[] = [
  {
    url: '/baldomero',
    icon: MessageSquareIcon
  },
  {
    url: '/baldomero/images',
    icon: ImageIcon
  },
  {
    url: '/baldomero/assistant',
    icon: PhoneCallIcon
  },
  {
    url: '/baldomero/knowledge',
    icon: BrainIcon
  }
];

export function ChatSidebar({ className }: { className?: string }) {
  const { segments } = useLocation();

  function isActive(url: string) {
    if (!segments[1] && '/baldomero' === url) return true;
    if (`/baldomero/${segments[1]}` === url) return true;
    return false;
  }

  return (
    <section className={cn(`flex-col gap-2 border-l p-2`, className)}>
      {sections.map((section) => (
        <Link
          key={section.url}
          href={section.url}
        >
          <Button
            variant={isActive(section.url) ? 'default' : 'ghost'}
            className="cursor-pointer"
          >
            <section.icon />
          </Button>
        </Link>
      ))}
    </section>
  );
}
