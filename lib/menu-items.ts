import { UserRole } from '@/lib/types/user';
import {
  IconDashboard,
  IconListDetails,
  IconChartBar,
  IconFolder,
  IconUsers,
  IconArchive,
  IconSettings,
  IconReport,
} from '@tabler/icons-react';
import { BuildingOfficeIcon } from '@heroicons/react/24/outline';

export interface MenuItem {
  name: string;
  href: string;
  icon: React.ElementType;
  items?: MenuItem[];
  allowedRoles: UserRole[];
}

export const menuItems: MenuItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: IconDashboard,
    allowedRoles: ['ADMIN', 'OWNER', 'DIREKTUR', 'MANAJER']
  },
  {
    name: 'Presensi',
    href: '/dashboard/presensi',
    icon: IconListDetails,
    items: [
      {
        name: 'Absen',
        href: '/absen',
        icon: IconListDetails,
        allowedRoles: ['ADMIN', 'DIREKTUR', 'MANAJER', 'KEUANGAN', 'KEPALA_GUDANG', 'TEKNISI', 'KARYAWAN']
      },
      {
        name: 'History',
        href: '/absen/history',
        icon: IconListDetails,
        allowedRoles: ['ADMIN', 'DIREKTUR', 'MANAJER', 'KEUANGAN', 'KEPALA_GUDANG', 'TEKNISI', 'KARYAWAN']
      }
    ],
    allowedRoles: ['ADMIN', 'DIREKTUR', 'MANAJER', 'KEUANGAN', 'KEPALA_GUDANG', 'TEKNISI', 'KARYAWAN']
  },
  {
    name: 'Riwayat Absensi',
    href: '/riwayat_absensi',
    icon: IconChartBar,
    allowedRoles: ['ADMIN', 'OWNER', 'MANAJER']
  },
  {
    name: 'Surat',
    href: '/surat_keluar',
    icon: IconFolder,
    items: [{
      name:'Surat Keluar',
      href:'/surat_keluar',
      icon: IconFolder,
      allowedRoles: ['ADMIN', 'MANAJER']
    },
    {
      name:'Approval Surat Dinas',
      href:'/surat_keluar/approval_surat',
      icon: IconFolder,
      allowedRoles: ['OWNER', 'MANAJER', 'ADMIN', 'KEUANGAN']
  },
  {
    name: 'Approval Surat Alat',
    href: '/surat_keluar/approval_surat_alat',
    icon: IconFolder,
    allowedRoles: ['MANAJER', 'ADMIN']
  }],

  allowedRoles: ['ADMIN', 'OWNER', 'MANAJER', 'KEUANGAN']
}, 
  {
    name: 'Pegawai',
    href: '/pegawai',
    icon: IconUsers,
    allowedRoles: ['ADMIN', 'MANAJER']
  },
  {
    name: 'Inventory',
    href: '/inventory',
    icon: IconArchive,
    items: [
      {
        name: 'Alat Kalibrasi',
        href: '/inventory/alat_kalibrasi',
        icon: IconArchive,
        allowedRoles: ['ADMIN', 'DIREKTUR', 'KEPALA_GUDANG', 'TEKNISI']
      },
      {
        name: 'Sparepart',
        href: '/inventory/spare_part',
        icon: IconArchive,
        allowedRoles: ['ADMIN', 'KEPALA_GUDANG', 'TEKNISI']
      }
    ],
    allowedRoles: ['ADMIN', 'DIREKTUR', 'KEPALA_GUDANG', 'TEKNISI']
  },
  {
    name: 'Satuan Kerja',
    href: '/satuan_kerja',
    icon: BuildingOfficeIcon,
    items: [
      {
        name: 'Wilayah Kerja',
        href: '/satuan_kerja',
        icon: BuildingOfficeIcon,
        allowedRoles: ['ADMIN', 'MANAJER']
      },
      {
        name: 'Data Alat',
        href: '/satuan_kerja/data_alat',
        icon: BuildingOfficeIcon,
        allowedRoles: ['ADMIN', 'MANAJER']
      }
    ],
    allowedRoles: ['ADMIN', 'MANAJER']
  },
  {
    name: 'Laporan',
    href: '/laporan',
    icon: IconReport,
    allowedRoles: ['ADMIN']
  }
];
