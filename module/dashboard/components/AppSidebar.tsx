"use client";

import * as React from "react";
import {
  IconChartBar,
  IconDashboard,
  IconFolder,
  IconListDetails,
  IconSearch,
  IconSettings,
  IconUsers,
  IconArchive,
} from "@tabler/icons-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/module/dashboard/components/Sidebar";

// import { NavDocuments } from "@/module/dashboard/components/NavDocuments";
import { NavMain } from "@/module/dashboard/components/NavMain";
import NavSecondary from "@/module/dashboard/components/NavSecondary";
import { NavUser } from "@/module/dashboard/components/NavUser";
import Logo from "@/components/ui/logo";

const data = {
  user: {
    name: "PT. Aishy Health Calibration",
    email: "calibrationaishy@gmail.com",
    
  },
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: IconDashboard,
    },
    {
      title: "Presensi",
      url: "#",
      icon: IconListDetails,
      items: [
        {
          title: "Absen",
          url: "#",
          icon: "",
        },
        {
          title: "History",
          url: "#",
          icon: "",
        },
      ],
    },
    {
      title: "Riwayat Absensi",
      url: "#",
      icon: IconChartBar,
    },
    {
      title: "Surat Keluar",
      url: "#",
      icon: IconFolder,
    },
    {
      title: "Pegawai",
      url: "#",
      icon: IconUsers,
      items:[
        {
          title: "Data",
          url: "#",
          icon: "",
        },
        {
          title: "Jabatan",
          url: "#",
          icon: "",
        }
      ],
    },
    {
      title: "Inventory",
      url: "#",
      icon: IconArchive,
      items:[
        {
          title: "Alat Kalibrasi",
          url: "#",
          icon: "",
        },
        {
          title: "Sparepart",
          url: "#",
          icon: "",
        }
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
  // documents: [
  //   {
  //     name: "Laporan",
  //     url: "#",
  //     icon: IconReport,
  //   },
  // ],
};

export default function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
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

              <div className="w-full h-px  bg-white pb-0"></div>
            </div>
          
            {/* <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            ></SidebarMenuButton> */}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavDocuments items={data.documents} /> */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
