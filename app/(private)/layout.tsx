import { Suspense } from 'react';
import { AppHeader } from '@/components/layout/app-header';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { ChatHelper } from '@/components/layout/chat-helper';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { cookies } from 'next/headers';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <SidebarInset className="h-screen flex flex-col px-4 pb-4">
        <AppHeader />
        <div className="flex flex-1 gap-5">
          <Suspense>{children}</Suspense>
          <ChatHelper className="hidden 2xl:flex" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
