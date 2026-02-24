'use client';

import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { BotIcon, FileTextIcon, ImageIcon, LayoutDashboardIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
        title: 'Chatbots',
        url: '/chatbots',
        icon: BotIcon
      }
    ]
  },
  {
    title: 'Storage',
    items: [
      {
        title: 'Documents',
        url: '/documents',
        icon: FileTextIcon
      },
      {
        title: 'Multimedia',
        url: '/multimedia',
        icon: ImageIcon
      }
    ]
  }
];

export function NavMain() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  function isActive(url: string) {
    if (`/${segments[0]}` === url) return true;
    return false;
  }

  return (
    <>
      {sections.map((section, index) => (
        <SidebarGroup key={index}>
          <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {section.items?.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    className={cn(isActive(item.url) && 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground active:bg-primary active:text-primary-foreground')}
                  >
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  );
}
