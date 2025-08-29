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
  IconReport,
  IconArchive,
} from "@tabler/icons-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/module/dashboard/components/Sidebar";

import { NavMain } from "@/module/dashboard/components/NavMain";
import NavSecondary from "@/module/dashboard/components/NavSecondary";
import Logo from "@/components/ui/logo";
import { BuildingOfficeIcon } from "@heroicons/react/24/outline";
import {NavDocuments} from "@/module/dashboard/components/NavDocuments";
import { Role } from "@/lib/types/auth";


const data = {
  user: {
    name: "PT. Aishy Health Calibration",
    email: "calibrationaishy@gmail.com",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: IconDashboard,
      roles: ["admin", "manager", "owner"] as Role[],
    },
    {
      title: "Presensi",
      url: "#",
      icon: IconListDetails,
      items: [
        {
          title: "Absen",
          url: "/admin/absen",
          icon: "",
          roles: ["admin", "teknisi", "manager"] as Role[],
        },
        {
          title: "History",
          url: "/admin/absen/history",
          icon: "",
          roles: ["admin", "teknisi", "manager"] as Role[],
        },
      ],
    },
    {
      title: "Riwayat Absensi",
      url: "/admin/riwayat_absensi",
      icon: IconChartBar,
      roles: ["admin", "owner", "manager"] as Role[],
    },
    {
      title: "Surat Keluar",
      url: "#",
      icon: IconFolder,
      roles: ["admin", "owner", "manager"] as Role[],
    },
    {
      title: "Pegawai",
      url: "/admin/pegawai",
      icon: IconUsers,
      roles: ["admin"] as Role[],
    },
    {
      title: "Inventory",
      url: "#",
      icon: IconArchive,
      items: [
        {
          title: "Alat Kalibrasi",
          url: "#",
          icon: "",
          roles: ["admin", "teknisi", "manager", "owner"] as Role[],
        },
        {
          title: "Sparepart",
          url: "#",
          icon: "",
          roles: ["admin", "teknisi"] as Role[],
        },
      ],
    },
 
{
  title: "Satuan Kerja",
  url: "#",
  icon: BuildingOfficeIcon,
  items: [
    {
      title: "Wilayah Kerja",
      url: "#",
      icon: "",
      roles: ["admin", "manager"] as Role[],
    },
    {
      title: "Data Alat",
      url: "#",
      icon: "",
      roles: ["admin", "manager"] as Role[],
    },
  ], 
},
],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
      roles: ["admin"] as Role[],
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
      roles: ["admin"] as Role[],
    },
  ],

  documents: [
    {
      name: "Laporan",
      url: "#",
      icon: IconReport,
      roles: ["admin"] as Role[],
    },
  ],
};

type AppSidebarProps = {
  role: Role; 
};

export default function AppSidebar({ role,
  ...props
}: AppSidebarProps & React.ComponentProps<typeof Sidebar>) {
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
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
    
      <NavMain items={data.navMain} role={role} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
      <div className="w-full text-start py-3 text-xs text-gray-400 border-t border-gray-700">
        <p>© {2025} SIMKAR AHC</p>
      </div>
    
      </SidebarFooter>
    </Sidebar>
  );
}
