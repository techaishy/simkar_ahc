"use client";

import { Card } from "@/components/ui/card";
// import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import Image from "next/image";
import Breadcrumbs from "@/components/ui/breadcrumb";

type Absensi = {
  tanggal: string;
  waktu: string;
  tipe: "masuk" | "pulang";
  metode: "selfie" | "barcode" | "manual";
  lokasi: string;
  status: "Tepat Waktu" | "Terlambat" | "Tidak Hadir";
  imageUrl?: string;
};

const riwayatAbsensi: Absensi[] = [
  {
    tanggal: "23 Juli 2025",
    waktu: "07:55",
    tipe: "masuk",
    metode: "selfie",
    lokasi: "RS Melati",
    status: "Tepat Waktu",
    imageUrl: "/images/selfie1.png",
  },
  {
    tanggal: "23 Juli 2025",
    waktu: "17:02",
    tipe: "pulang",
    metode: "barcode",
    lokasi: "RS Melati",
    status: "Tepat Waktu",
  },
  {
    tanggal: "22 Juli 2025",
    waktu: "08:01",
    tipe: "masuk",
    metode: "manual",
    lokasi: "Kantor Banda",
    status: "Terlambat",
  },
  {
    tanggal: "22 Juli 2025",
    waktu: "17:00",
    tipe: "pulang",
    metode: "selfie",
    lokasi: "Kantor Banda",
    status: "Tepat Waktu",
    imageUrl: "/images/selfie2.png",
  },
];

function getStatusClass(status: string) {
  switch (status) {
    case "Tepat Waktu":
      return "text-green-600 font-semibold";
    case "Terlambat":
      return "text-yellow-600 font-semibold";
    case "Tidak Hadir":
      return "text-red-600 font-semibold";
    default:
      return "text-gray-500";
  }
}

export default function HistoryAbsensi() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="p-4 space-y-4">
      <div className="p-6 font-semibold">
      <Breadcrumbs />
    </div>

      {/* <ScrollArea className="h-[400px] pr-2"> */}
        <div className="space-y-3">
          {riwayatAbsensi.map((absen, index) => (
            <Card key={index} className="p-4 shadow-md space-y-1">
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold text-black">
                    {absen.tipe === "masuk" ? "Absen Masuk" : "Absen Pulang"}
                  </p>
                  <p className="text-sm text-gray-600">{absen.tanggal}</p>
                  <p className="text-sm text-gray-500">Lokasi: {absen.lokasi}</p>
                  <p className={`text-sm ${getStatusClass(absen.status)}`}>
                    Status: {absen.status}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-medium text-black text-lg">{absen.waktu}</p>
                  {absen.metode === "selfie" && absen.imageUrl ? (
                    <button
                      onClick={() => setSelectedImage(absen.imageUrl!)}
                      className="text-sm text-blue-500 hover:underline"
                    >
                      Lihat Selfie
                    </button>
                  ) : absen.metode === "manual" ? (
                    <p className="text-sm text-gray-500">Manual</p>
                  ) : (
                    <p className="text-sm text-gray-500">Barcode</p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      {/* </ScrollArea> */}

      {/* Modal Preview Image */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div className="bg-white rounded-md p-4">
            <Image
              src={selectedImage}
              alt="Selfie Absensi"
              width={300}
              height={400}
              className="rounded-md"
            />
          </div>
        </div>
      )}
    </div>
  );
}

// "use client";

// import { Card } from "@/components/ui/card";
// import { ScrollArea } from "@/components/ui/scroll-area";

// type Absensi = {
//   tanggal: string;
//   waktu: string;
//   tipe: "masuk" | "pulang";
//   metode: "selfie" | "barcode" | "manual";
// };

// const riwayatAbsensi: Absensi[] = [
//   { tanggal: "23 Juli 2025", waktu: "07:55", tipe: "masuk", metode: "selfie" },
//   { tanggal: "23 Juli 2025", waktu: "17:02", tipe: "pulang", metode: "barcode" },
//   { tanggal: "22 Juli 2025", waktu: "08:01", tipe: "masuk", metode: "manual" },
//   { tanggal: "22 Juli 2025", waktu: "17:00", tipe: "pulang", metode: "selfie" },
// ];

// export default function HistoryAbsensi() {
//   return (
//     <div className="p-4 space-y-4">
//       <h2 className="text-xl font-bold">Riwayat Absensi</h2>
//       <ScrollArea className="h-[400px]">
//         <div className="space-y-3">
//           {riwayatAbsensi.map((absen, index) => (
//             <Card key={index} className="p-4 flex items-center justify-between shadow-md">
//               <div>
//                 <p className="font-semibold text-black">
//                   {absen.tipe === "masuk" ? "Absen Masuk" : "Absen Pulang"}
//                 </p>
//                 <p className="text-sm text-gray-600">{absen.tanggal}</p>
//               </div>
//               <div className="text-right">
//                 <p className="font-medium text-black">{absen.waktu}</p>
//                 <p className="text-sm text-gray-500 capitalize">{absen.metode}</p>
//               </div>
//             </Card>
//           ))}
//         </div>
//       </ScrollArea>
//     </div>
//   );
// }
