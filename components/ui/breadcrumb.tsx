// "use client"

// import { usePathname } from "next/navigation"
// import Link from "next/link"
// import { ChevronRight } from "lucide-react"

// const nameMap: Record<string, string> = {
//     "admin": "Dashboard",
//     "dashboard": "Dashboard",
//     "presensi": "Presensi",
//     "absen": "Absen",
//     "history": "History",
//     "riwayat-absensi": "Riwayat Absensi",
//     "surat-keluar": "Surat Keluar",
//     "pegawai": "Pegawai",
//     "inventory": "Inventory",
//     "satuan-kerja": "Satuan Kerja",
//     "laporan": "Laporan",
// }

// export default function Breadcrumbs() {
//   const pathname = usePathname()
//   const pathArray = pathname.split("/").filter((p) => p)

//   return (
//     <nav className="text-xl text-gray-600 mb-0">
//       <ol className="flex flex-wrap items-center gap-2">
//         {pathArray.map((segment, index) => {
//           const href = "/" + pathArray.slice(0, index + 1).join("/")
//           const isLast = index === pathArray.length - 1
//           return (
//             <li key={index} className="flex items-center gap-2">
//               {!isLast ? (
//                 <Link href={href} className="text-blue-600 hover:underline capitalize">
//                   {nameMap[segment] || segment.replace(/-/g, " ")}
//                 </Link>
//               ) : (
//                 <span className="capitalize font-medium">
//                   {nameMap[segment] || segment.replace(/-/g, " ")}
//                 </span>
//               )}
//               {!isLast && <ChevronRight className="w-4 h-4" />}
//             </li>
//           )
//         })}
//       </ol>
//     </nav>
//   )
// }
"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

const nameMap: Record<string, string> = {
  "admin": "Dashboard",
  "dashboard": "Dashboard",
  "presensi": "Presensi",
  "absen": "Absen",
  "history": "History",
  "riwayat_absensi": "Riwayat Absensi",
  "riwayat-absensi": "Riwayat Absensi", 
  "surat-keluar": "Surat Keluar",
  "pegawai": "Pegawai",
  "inventory": "Inventory",
  "satuan-kerja": "Satuan Kerja",
  "laporan": "Laporan",
}

export default function Breadcrumbs() {
  const pathname = usePathname()
  const pathArray = pathname.split("/").filter((p) => p)

  return (
    <nav className="text-xl text-gray-600 mb-0">
      <ol className="flex flex-wrap items-center gap-2">
        {pathArray.map((segment, index) => {
          const href = "/" + pathArray.slice(0, index + 1).join("/")
          const isLast = index === pathArray.length - 1

          // ✅ handle khusus untuk "admin" supaya link-nya ke /admin/dashboard
          const segmentName = nameMap[segment] || segment.replace(/-/g, " ")
          let segmentHref = href

          if (segment === "admin") {
            segmentHref = "/admin/dashboard"
          }

          return (
            <li key={index} className="flex items-center gap-2">
              {!isLast ? (
                <Link
                  href={segmentHref}
                  className="text-blue-600 hover:underline capitalize"
                >
                  {segmentName}
                </Link>
              ) : (
                <span className="capitalize font-medium">{segmentName}</span>
              )}
              {!isLast && <ChevronRight className="w-4 h-4" />}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
