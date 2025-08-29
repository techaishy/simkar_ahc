"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/module/dashboard/components/Sidebar";

interface NavDocumentsProps {
  items: {
    name: string;
    url: string;
    icon: React.ElementType;
  }[];
}

export function NavDocuments({ items }: NavDocumentsProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Report</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item, i) => (
            <SidebarMenuItem key={i}>
              <SidebarMenuButton asChild className="text-gray-300 hover:text-black hover:bg-gradient-to-r hover:from-[#d2e67a] hover:to-[#f9fc4f]">
                <a href={item.url}>
                  <item.icon />
                  <span>{item.name}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
