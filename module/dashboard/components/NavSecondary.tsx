"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/module/dashboard/components/Sidebar";

import {
  IconSettings,
  IconHelpCircle,
} from "@tabler/icons-react";

interface NavItem {
    title: string;
    url: string;
    icon?: React.ElementType;
  }
  
  interface NavSecondaryProps {
    items: NavItem[];
    className?: string;
  }

export default function NavSecondary({ items, className }: NavSecondaryProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Pengaturan</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              icon={<IconSettings size={20} />}
              label="Settings"
              href="/dashboard/settings"
            />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              icon={<IconHelpCircle size={20} />}
              label="Bantuan"
              href="/dashboard/help"
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
