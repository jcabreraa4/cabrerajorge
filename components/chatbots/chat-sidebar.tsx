'use client';

import { Button } from '@/components/ui/button';
import { useLocation } from '@/hooks/use-location';
import { type LucideIcon, ImageIcon, MessageSquareIcon, PhoneCallIcon, SettingsIcon } from 'lucide-react';
import Link from 'next/link';

type Section = {
  url: string;
  icon: LucideIcon;
};

const sections: Section[] = [
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
    url: '/baldomero/settings',
    icon: SettingsIcon
  }
];

export function ChatSidebar() {
  const { segments } = useLocation();

  function isActive(url: string) {
    if (!segments[1] && '/baldomero' === url) return true;
    if (`/baldomero/${segments[1]}` === url) return true;
    return false;
  }

  return (
    <section className="hidden xl:flex flex-col gap-2 border-l px-2 py-4">
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
