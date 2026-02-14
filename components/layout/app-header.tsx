'use client';

import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { BotIcon } from 'lucide-react';
import { useChatHelperStore } from '@/store/helper-store';

function capitalize(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function AppHeader() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  const toggleShow = useChatHelperStore((state) => state.toggleShow);

  const word1 = segments[0] ? capitalize(segments[0]) : '';
  const word2 = segments[1] ? capitalize(segments[1]) : '';

  const isChatbotPage = segments[1] === 'chatbot';

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 print:hidden justify-between">
      <div className="flex items-center gap-1">
        <SidebarTrigger className="-ml-1 cursor-pointer" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbPage>{word1}</BreadcrumbPage>
            </BreadcrumbItem>
            {word2 && (
              <>
                <BreadcrumbSeparator className="hidden md:block text-black" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{word2}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      {!isChatbotPage && (
        <Button
          variant="outline"
          className="cursor-pointer hidden 2xl:block"
          onClick={toggleShow}
        >
          <BotIcon />
        </Button>
      )}
    </header>
  );
}
