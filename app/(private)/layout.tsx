import { Suspense } from 'react';
import { AppHeader } from '@/components/layout/app-header';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { AppChatbot } from '@/components/layout/app-chatbot';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { cookies } from 'next/headers';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <SidebarInset className="h-svh overflow-hidden pb-3 lg:pb-4">
        <AppHeader />
        <div className="flex flex-1 min-h-0 overflow-hidden">
          <div className="flex flex-1 min-h-0 overflow-hidden pt-1 px-3 lg:px-4">
            <Suspense>{children}</Suspense>
          </div>
          <AppChatbot className="hidden 2xl:flex" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
