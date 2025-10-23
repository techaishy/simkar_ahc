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

import { Barcode } from 'lucide-react';
import { BuildingOfficeIcon } from '@heroicons/react/24/outline';

export interface MenuItem {
  name: string;
  href: string;
  icon: React.ElementType;
  items?: MenuItem[];
  allowedRoles: UserRole[];
  available?: boolean;
}

export const menuItems: MenuItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: IconDashboard,
    allowedRoles: ['ADMIN', 'OWNER', 'DIREKTUR', 'MANAJER'],
    available: true,
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
        allowedRoles: ['ADMIN', 'DIREKTUR', 'MANAJER', 'KEUANGAN', 'KEPALA_GUDANG', 'TEKNISI', 'KARYAWAN'],
        available: true,
      },
      {
        name: 'History',
        href: '/absen/history',
        icon: IconListDetails,
        allowedRoles: ['ADMIN', 'DIREKTUR', 'MANAJER', 'KEUANGAN', 'KEPALA_GUDANG', 'TEKNISI', 'KARYAWAN'],
        available: true,
      }
    ],
    allowedRoles: ['ADMIN', 'DIREKTUR', 'MANAJER', 'KEUANGAN', 'KEPALA_GUDANG', 'TEKNISI', 'KARYAWAN']
  },
  {
    name: 'Riwayat Absensi',
    href: '/riwayat_absensi',
    icon: IconChartBar,
    allowedRoles: ['ADMIN', 'OWNER', 'MANAJER'],
    available: true,
  },
  {
    name: 'Surat',
    href: '/surat_keluar',
    icon: IconFolder,
    items: [{
        name:'Surat Keluar',
        href:'/surat_keluar',
        icon: IconFolder,
        allowedRoles: ['ADMIN', 'MANAJER'],
        available: true,
      },
      {
        name:'Approval Surat',
        href:'/surat_keluar/approval_surat',
        icon: IconFolder,
        allowedRoles: ['OWNER', 'MANAJER', 'ADMIN'],
        available: true,
      },
       {
        name:'Approval Surat Alat',
        href:'/surat_keluar/approval_surat_alat',
        icon: IconFolder,
        allowedRoles: ['OWNER', 'MANAJER', 'ADMIN'],
        available: true,
      } 
    ],
    allowedRoles: ['ADMIN', 'OWNER', 'MANAJER']
  },
  {
    name: 'Pegawai',
    href: '/pegawai',
    icon: IconUsers,
    allowedRoles: ['ADMIN', 'MANAJER'],
    available: true,
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
        allowedRoles: ['ADMIN', 'DIREKTUR', 'KEPALA_GUDANG', 'TEKNISI'],
        available: true,
      },
      // {
      //   name: 'Sparepart',
      //   href: '/inventory/spare_part',
      //   icon: IconArchive,
      //   allowedRoles: ['ADMIN', 'KEPALA_GUDANG', 'TEKNISI'],
      //   available: true,
      // }
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
        allowedRoles: ['ADMIN', 'MANAJER'],
        available: true,
      },
      {
        name: 'Data Alat',
        href: '/satuan_kerja/data_alat',
        icon: BuildingOfficeIcon,
        allowedRoles: ['ADMIN', 'MANAJER'],
        available: true,
      }
    ],
    allowedRoles: ['ADMIN', 'MANAJER']
  },
  {
  name: 'QR Code',
  href: '/barcode',
  icon: Barcode,
  items: [
    {
    name: 'Generate QR Code',
    href: '/barcode',
    icon: Barcode,
    allowedRoles: ['ADMIN', 'TEKNISI']
  }, 
  {
    name: 'Scan QR Code',
    href: '/barcode/scanner',
    icon: Barcode,
    allowedRoles: ['ADMIN', 'TEKNISI', 'MANAJER']
  }],

  allowedRoles: ['ADMIN', 'TEKNISI']
  },
  // {
  //   name: 'Pengaturan',
  //   href: '/settings',
  //   icon: IconSettings,
  //   allowedRoles: ['ADMIN']
  // },
  // {
  //   name: 'Laporan',
  //   href: '/laporan',
  //   icon: IconReport,
  //   allowedRoles: ['ADMIN'],
  //   available: false,
  // }
];
