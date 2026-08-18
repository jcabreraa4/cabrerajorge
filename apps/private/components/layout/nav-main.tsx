import { ChartBarIcon, FolderIcon, LayoutDashboardIcon, ListIcon, UsersIcon } from 'lucide-react';

import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@workspace/ui/components/sidebar';

const navMain = [
  {
    title: 'Dashboard',
    url: '#',
    icon: <LayoutDashboardIcon />
  },
  {
    title: 'Lifecycle',
    url: '#',
    icon: <ListIcon />
  },
  {
    title: 'Analytics',
    url: '#',
    icon: <ChartBarIcon />
  },
  {
    title: 'Projects',
    url: '#',
    icon: <FolderIcon />
  },
  {
    title: 'Team',
    url: '#',
    icon: <UsersIcon />
  }
];

export function NavMain() {
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {navMain.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title}>
                {item.icon}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
