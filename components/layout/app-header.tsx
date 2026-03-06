'use client';

import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { BotIcon } from 'lucide-react';
import { useChatHelperStore } from '@/store/helper-store';
import { useLocation } from '@/hooks/use-location';
import { useDevice } from '@/hooks/use-device';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useRouter } from 'next/navigation';
import { sections } from '@/components/chatbots/chat-sidebar';
import Link from 'next/link';

const chatbotPage = 'baldomero';

function capitalize(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function AppHeader() {
  const { segments } = useLocation();
  const device = useDevice();
  const router = useRouter();

  const section = capitalize(segments[0]);
  const hideChatbot = segments[0] === chatbotPage;

  const show = useChatHelperStore((state) => state.show);
  const toggleShow = useChatHelperStore((state) => state.toggleShow);

  return (
    <header className="flex h-12 xl:h-16 bg-sidebar shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 print:hidden justify-between px-3 lg:px-4 border-b">
      <div className="flex items-center gap-1">
        <SidebarTrigger className="-ml-1 cursor-pointer" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link href={`/${segments[0]}`}>
                <BreadcrumbPage>{section}</BreadcrumbPage>
              </Link>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      {!hideChatbot ? (
        <Button
          variant={show ? 'default' : 'outline'}
          className="cursor-pointer hidden 2xl:block"
          onClick={toggleShow}
        >
          <BotIcon />
        </Button>
      ) : (
        device !== 'computer' && (
          <Select
            value={segments[1] ? `/${segments[0]}/${segments[1]}` : `/${segments[0]}`}
            onValueChange={(value) => router.push(value)}
          >
            <SelectTrigger className="cursor-pointer border-0 shadow-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sections.map((section) => (
                <SelectItem
                  key={section.url}
                  value={section.url}
                >
                  <section.icon />
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      )}
    </header>
  );
}
