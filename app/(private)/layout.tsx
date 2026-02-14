import { AppHeader } from '@/components/layout/app-header';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { ChatHelper } from '@/components/layout/chat-helper';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Suspense } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="h-dvh min-h-0 p-4 pt-0 flex flex-col">
        <AppHeader />
        <div className="flex-1 min-h-0 min-w-0 flex gap-5">
          <div className="flex-1 min-h-0 min-w-0 flex">
            <Suspense>{children}</Suspense>
          </div>
          <ChatHelper className="hidden 2xl:flex" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
