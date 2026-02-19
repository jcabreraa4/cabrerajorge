import { NavMain } from '@/components/layout/nav-main';
import { NavUser } from '@/components/layout/nav-user';
import { Sidebar, SidebarHeader, SidebarContent, SidebarRail } from '@/components/ui/sidebar';
import { currentUser } from '@clerk/nextjs/server';
import { BotIcon, FileTextIcon, LayoutDashboardIcon } from 'lucide-react';

const sections = [
  {
    title: 'Dashboard',
    items: [
      {
        title: 'Overview',
        url: '/overview',
        icon: LayoutDashboardIcon
      },
      {
        title: 'Chatbot',
        url: '/chatbot',
        icon: BotIcon
      }
    ]
  },
  {
    title: 'Storage',
    items: [
      {
        title: 'Documents',
        url: '/papers',
        icon: FileTextIcon
      },
      {
        title: 'Multimedia',
        url: '/storage',
        icon: FileTextIcon
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
        <NavMain sections={sections} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
