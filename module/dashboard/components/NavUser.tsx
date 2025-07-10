"use client";

import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/module/dashboard/components/Sidebar";

interface NavUserProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export function NavUser({ user }: NavUserProps) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <div className="flex items-center gap-3 p-2">
            <div className="bg-gray-300 rounded-full w-8 h-8" />
            <div className="flex flex-col text-left">
              <span className="text-sm font-medium">{user.name}</span>
              <span className="text-xs text-gray-400">{user.email}</span>
            </div>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
