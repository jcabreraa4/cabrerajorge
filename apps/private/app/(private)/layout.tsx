import { SidebarInset, SidebarProvider } from '@workspace/ui/components/sidebar';

import { AppHeader } from '@/components/layout/app-header';
import { AppSidebar } from '@/components/layout/app-sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)'
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <AppHeader />
        {children}
      </SidebarInset>
      <SidebarInset className="p-4 xl:max-w-100">Chatbot</SidebarInset>
    </SidebarProvider>
  );
}
