import { NavMain } from '@/components/layout/nav-main';
import { NavUser } from '@/components/layout/nav-user';
import { Sidebar, SidebarContent, SidebarHeader, SidebarRail } from '@/components/ui/sidebar';
import { currentUser } from '@clerk/nextjs/server';
import { LayoutDashboardIcon } from 'lucide-react';

const items = [
  {
    title: 'Dashboard',
    icon: LayoutDashboardIcon,
    isActive: true,
    items: [
      {
        title: 'Overview',
        url: '/dashboard/overview'
      },
      {
        title: 'Chatbot',
        url: '/dashboard/chatbot'
      },
      {
        title: 'Papers',
        url: '/dashboard/papers'
      },
      {
        title: 'Storage',
        url: '/dashboard/storage'
      }
    ]
  }
];

export async function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = await currentUser();

  const userData = {
    name: user!.fullName || 'User',
    email: user!.emailAddresses[0].emailAddress,
    avatar: user!.imageUrl
  };

  return (
    <Sidebar
      collapsible="icon"
      {...props}
    >
      <SidebarHeader>
        <NavUser user={userData} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={items} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
