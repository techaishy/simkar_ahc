
// "use client";

// import { useState } from "react";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogTrigger,
// } from "@/components/ui/dialog";

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

// type Pegawai = {
//   id: string;
//   name: string;
//   nip?: string;
//   position: string;
//   NIK: string;
//   phone: string;
//   emailPribadi?: string;
//   status: "Aktif" | "Nonaktif";
// };

// type Props = {
//     onEdit: (id: string) => void;
//     onDelete: (id: string) => void;
// }

// const dummyPegawai: Pegawai[] = [
//   {
//     id: "1",
//     name: "Andi Wijaya",
//     nip: "1987654321",
//     position: "Teknisi",
//     NIK: "123456789123",
//     phone: "081234567890",
//     emailPribadi: "andi@gmail.com",
//     status: "Aktif",
//   },
//   {
//     id: "2",
//     name: "Siti Aminah",
//     nip: "1987654322",
//     position: "Manager",
//     NIK: "123456",
//     phone: "081298765432",
//     emailPribadi: "siti@gmail.com",
//     status: "Aktif",
//   },
//   {
//     id: "3",
//     name: "Budi Santoso",
//     nip: "1987654323",
//     position: "Admin",
//     NIK: "123456",
//     phone: "081212345678",
//     emailPribadi: "budi@gmail.com",
//     status: "Nonaktif",
//   },
// ];

// export default function DataPegawaiTable({onEdit, onDelete}: Props) {
//   const [pegawai, setPegawai] = useState<Pegawai[]>(dummyPegawai);
//   const [selectedPegawai, setSelectedPegawai] = useState<Pegawai | null>(null);

//   return (
//     <Card className="p-4 w-full">
//       <h2 className="text-lg font-semibold mb-4">Data Pegawai</h2>
//       <div className="overflow-x-auto">
//         <table className="min-w-[400px] w-full border-collapse text-xs md:text-sm">
//           <thead>
//             <tr className="bg-gray-100 text-left">
//               <th className="p-2">ID</th>
//               <th className="p-2">Nama Pegawai</th>
//               <th className="p-2">NIP</th>
//               <th className="p-2">Jabatan</th>

//               {/* kolom lain hanya tampil di desktop */}
//               <th className="p-2 hidden md:table-cell">NIK</th>
//               <th className="p-2 hidden md:table-cell">Alamat</th>
//               <th className="p-2 hidden md:table-cell">Telpon</th>
//               <th className="p-2 hidden md:table-cell">Email</th>
//               <th className="p-2 hidden md:table-cell">Status</th>
//               <th className="p-2 hidden md:table-cell">Aksi</th>
//               <th className="p-2 block md:hidden">Detail</th>
//             </tr>
//           </thead>
//           <tbody>
//             {pegawai.map((p) => (
//               <tr key={p.id} className="hover:bg-gray-50 border-t">
//                 <td className="p-2">{p.id}</td>
//                 <td className="p-2">{p.name}</td>
//                 <td className="p-2">{p.nip}</td>
//                 <td className="p-2">{p.position}</td>

//                 {/* hanya muncul di desktop */}
//                 <td className="p-2 hidden md:table-cell">{p.NIK}</td>
//                 <td className="p-2 hidden md:table-cell">-</td>
//                 <td className="p-2 hidden md:table-cell">{p.phone}</td>
//                 <td className="p-2 hidden md:table-cell">{p.emailPribadi}</td>
//                 <td className="p-2 hidden md:table-cell">
//                   <Badge
//                     variant={p.status === "Aktif" ? "default" : "secondary"}
//                   >
//                     {p.status}
//                   </Badge>
//                 </td>

//                 {/* 🔹 Modern Dropdown Aksi */}
//                 <td className="p-2 hidden md:table-cell text-right">
//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <Button variant="ghost" size="icon" className="h-8 w-8">
//                         <MoreHorizontal className="h-4 w-4" />
//                       </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent align="end">
//                       <DropdownMenuItem onClick={()=> onEdit(p.id)}>
//                         <Pencil className="mr-2 h-4 w-4 text-blue-600" />
//                        <p className="text-gray-600"> Edit</p>
//                       </DropdownMenuItem >
//                       <DropdownMenuItem  onClick={() => setPegawai(pegawai.filter((item) => item.id !== p.id))} className="text-red-600">
//                         <Trash2 className="mr-2 h-4 w-4" />
//                         Hapus
//                       </DropdownMenuItem>
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 </td>

//                 {/* Mobile: tombol detail */}
//                 <td className="p-2 block md:hidden">
//                   <Dialog>
//                     <DialogTrigger asChild>
//                       <Button
//                         className="text-blue-600"
//                         size="sm"
//                         variant="ghost"
//                         onClick={() => setSelectedPegawai(p)}
//                       >
//                         Lihat Detail
//                       </Button>
//                     </DialogTrigger>
//                     <DialogContent className="bg-white dark:bg-gray-900 rounded-xl shadow-lg sm:max-w-sm w-full">
//                       <DialogHeader>
//                         <DialogTitle>Detail Pegawai</DialogTitle>
//                         <DialogDescription>
//                           Informasi lengkap tentang pegawai.
//                         </DialogDescription>
//                       </DialogHeader>
//                       {selectedPegawai && (
//                         <div className="mt-4 space-y-2 text-sm">
//                           <div className="grid grid-cols-3 gap-2">
//                             <span className="font-medium">ID</span>
//                             <span className="col-span-2">
//                               {selectedPegawai.id}
//                             </span>
//                           </div>
//                           <div className="grid grid-cols-3 gap-2">
//                             <span className="font-medium">Nama</span>
//                             <span className="col-span-2">
//                               {selectedPegawai.name}
//                             </span>
//                           </div>
//                           <div className="grid grid-cols-3 gap-2">
//                             <span className="font-medium">NIP</span>
//                             <span className="col-span-2">
//                               {selectedPegawai.nip}
//                             </span>
//                           </div>
//                           <div className="grid grid-cols-3 gap-2">
//                             <span className="font-medium">Jabatan</span>
//                             <span className="col-span-2">
//                               {selectedPegawai.position}
//                             </span>
//                           </div>
//                           <div className="grid grid-cols-3 gap-2">
//                             <span className="font-medium">NIK</span>
//                             <span className="col-span-2">
//                               {selectedPegawai.NIK}
//                             </span>
//                           </div>
//                           <div className="grid grid-cols-3 gap-2">
//                             <span className="font-medium">Alamat</span>
//                             <span className="col-span-2">-</span>
//                           </div>
//                           <div className="grid grid-cols-3 gap-2">
//                             <span className="font-medium">Telepon</span>
//                             <span className="col-span-2">
//                               {selectedPegawai.phone}
//                             </span>
//                           </div>
//                           <div className="grid grid-cols-3 gap-2">
//                             <span className="font-medium">Email</span>
//                             <span className="col-span-2">
//                               {selectedPegawai.emailPribadi}
//                             </span>
//                           </div>
//                           <div className="grid grid-cols-3 gap-2">
//                             <span className="font-medium">Status</span>
//                             <span className="col-span-2">
//                               <Badge
//                                 variant={
//                                   selectedPegawai.status === "Aktif"
//                                     ? "default"
//                                     : "secondary"
//                                 }
//                               >
//                                 {selectedPegawai.status}
//                               </Badge>
//                             </span>
//                           </div>
//                         </div>
//                       )}
//                     </DialogContent>
//                   </Dialog>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </Card>
//   );
// }
"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

type Pegawai = {
  id: string;
  name: string;
  nip?: string;
  position: string;
  NIK: string;
  phone: string;
  emailPribadi?: string;
  status: "Aktif" | "Nonaktif";
};

type Props = {
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

const dummyPegawai: Pegawai[] = [
  {
    id: "1",
    name: "Andi Wijaya",
    nip: "1987654321",
    position: "Teknisi",
    NIK: "123456789123",
    phone: "081234567890",
    emailPribadi: "andi@gmail.com",
    status: "Aktif",
  },
  {
    id: "2",
    name: "Siti Aminah",
    nip: "1987654322",
    position: "Manager",
    NIK: "123456",
    phone: "081298765432",
    emailPribadi: "siti@gmail.com",
    status: "Aktif",
  },
  {
    id: "3",
    name: "Budi Santoso",
    nip: "1987654323",
    position: "Admin",
    NIK: "123456",
    phone: "081212345678",
    emailPribadi: "budi@gmail.com",
    status: "Nonaktif",
  },
];

export default function DataPegawaiTable({ onEdit, onDelete }: Props) {
  const [pegawai, setPegawai] = useState<Pegawai[]>(dummyPegawai);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pegawaiToDelete, setPegawaiToDelete] = useState<Pegawai | null>(null);

  const handleDelete = () => {
    if (pegawaiToDelete) {
      setPegawai((prev) => prev.filter((item) => item.id !== pegawaiToDelete.id));
      onDelete(pegawaiToDelete.id);
      setPegawaiToDelete(null);
      setIsDialogOpen(false); // ⬅️ tutup dialog setelah hapus
    }
  };

  return (
    <Card className="p-4 w-full">
      <h2 className="text-lg font-semibold mb-4">Data Pegawai</h2>
      <div className="overflow-x-auto">
        <table className="min-w-[400px] w-full border-collapse text-xs md:text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">ID</th>
              <th className="p-2">Nama Pegawai</th>
              <th className="p-2">NIP</th>
              <th className="p-2">Jabatan</th>
              <th className="p-2 hidden md:table-cell">NIK</th>
              <th className="p-2 hidden md:table-cell">Telpon</th>
              <th className="p-2 hidden md:table-cell">Email</th>
              <th className="p-2 hidden md:table-cell">Status</th>
              <th className="p-2 hidden md:table-cell">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {pegawai.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 border-t">
                <td className="p-2">{p.id}</td>
                <td className="p-2">{p.name}</td>
                <td className="p-2">{p.nip}</td>
                <td className="p-2">{p.position}</td>
                <td className="p-2 hidden md:table-cell">{p.NIK}</td>
                <td className="p-2 hidden md:table-cell">{p.phone}</td>
                <td className="p-2 hidden md:table-cell">{p.emailPribadi}</td>
                <td className="p-2 hidden md:table-cell">
                  <Badge variant={p.status === "Aktif" ? "default" : "secondary"}>
                    {p.status}
                  </Badge>
                </td>

                {/* 🔹 Dropdown Aksi */}
                <td className="p-2 hidden md:table-cell text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(p.id)}>
                        <Pencil className="mr-2 h-4 w-4 text-blue-600" />
                        <span className="text-gray-600">Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setPegawaiToDelete(p);
                          setIsDialogOpen(true);
                        }}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Hapus
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🔹 Dialog hanya sekali di luar loop */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus pegawai{" "}
              <b>{pegawaiToDelete?.name}</b>?<br />
              Tindakan ini tidak bisa dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Hapus
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
