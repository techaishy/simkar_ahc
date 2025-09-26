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
    allowedRoles: ['ADMIN', 'OWNER', 'DIREKTUR', 'MANAJER', 'KEUANGAN', 'KEPALA_GUDANG', 'TEKNISI', 'KARYAWAN']
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
    name: 'Surat Keluar',
    href: '/surat-keluar',
    icon: IconFolder,
    allowedRoles: ['ADMIN', 'OWNER', 'MANAJER']
  },
  {
    name: 'Pegawai',
    href: '/admin/pegawai',
    icon: IconUsers,
    allowedRoles: ['ADMIN', 'MANAJER']
  },
  {
    name: 'Inventory',
    href: '/admin/inventory',
    icon: IconArchive,
    items: [
      {
        name: 'Alat Kalibrasi',
        href: '/admin/inventory/alat_kalibrasi',
        icon: IconArchive,
        allowedRoles: ['ADMIN', 'DIREKTUR', 'KEPALA_GUDANG', 'TEKNISI']
      },
      {
        name: 'Sparepart',
        href: '/admin/inventory/spare_part',
        icon: IconArchive,
        allowedRoles: ['ADMIN', 'KEPALA_GUDANG', 'TEKNISI']
      }
    ],
    allowedRoles: ['ADMIN', 'DIREKTUR', 'KEPALA_GUDANG', 'TEKNISI']
  },
  {
    name: 'Satuan Kerja',
    href: '/admin/satuan_kerja',
    icon: BuildingOfficeIcon,
    items: [
      {
        name: 'Wilayah Kerja',
        href: '/admin/satuan_kerja/wilayah',
        icon: BuildingOfficeIcon,
        allowedRoles: ['ADMIN', 'MANAJER']
      },
      {
        name: 'Data Alat',
        href: '/admin/satuan_kerja/data_alat',
        icon: BuildingOfficeIcon,
        allowedRoles: ['ADMIN', 'MANAJER']
      }
    ],
    allowedRoles: ['ADMIN', 'MANAJER']
  },
  {
    name: 'Laporan',
    href: '/admin/laporan',
    icon: IconReport,
    allowedRoles: ['ADMIN']
  }
];
