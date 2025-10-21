"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/module/dashboard/components/Sidebar";
import { NavMain } from "@/module/dashboard/components/NavMain";
import { NavDocuments } from "@/module/dashboard/components/NavDocuments";
import Logo from "@/components/ui/logo";
import { UserRole } from "@/lib/types/user";
import { menuItems, MenuItem } from "@/lib/menu-items";

function filterMenuByRole(items: MenuItem[], role: UserRole): MenuItem[] {
  return items
    .filter((item) => item.allowedRoles.length === 0 || item.allowedRoles.includes(role))
    .map((item) => ({
      ...item,
      href: item.available === false ? "/maintenance" : item.href, 
      items: item.items ? filterMenuByRole(item.items, role) : [],
    }));
}

type AppSidebarProps = {
  role: UserRole;
};

export default function AppSidebar({
  role,
  ...props
}: AppSidebarProps & React.ComponentProps<typeof Sidebar>) {
  const filteredMenu = filterMenuByRole(menuItems, role);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="m-2 flex items-start gap-2">
              <Logo />
              <div className="w-px h-10 bg-white"></div>
              <span className="text-base font-semibold leading-tight">
                PT. Aishy Health Calibration
              </span>
            </div>
            <div className="p-1">
              <div className="text-xs mt-1 pb-2">
                SISTEM MANAJEMEN KANTOR
                <br />
                (SIMKAR)
              </div>
              <div className="w-full h-px bg-white pb-0"></div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={filteredMenu} role={role} />
        <NavDocuments items={[]} />
      </SidebarContent>

      <SidebarFooter>
        <div className="w-full text-start py-3 text-xs text-gray-400 border-t border-gray-700">
          <p>© {new Date().getFullYear()} SIMKAR AHC</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
