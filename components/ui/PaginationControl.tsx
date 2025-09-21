
"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaginationControlProps {
  totalPages: number;
  currentPage: number;
  perPage: number;
  onPageChange: (page: number, perPage: number) => void;
  classname?: string;
}

export default function PaginationControl({
  totalPages,
  currentPage,
  perPage,
  onPageChange,
}: PaginationControlProps) {
  const changePage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page, perPage);
    }
  };

  const changePerPage = (value: number) => {
    // kalau ganti jumlah per page, reset ke halaman 1
    onPageChange(1, value);
  };

  // 🔹 Generate daftar halaman dengan ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 4) {
        pages.push("...");
      }

      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 3) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="w-full mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Jumlah data per halaman */}
      <div className="flex items-center gap-2 justify-center sm:justify-start">
        <span className="text-sm text-gray-600">Tampilkan:</span>
        <Select
          value={String(perPage)}
          onValueChange={(val) => changePerPage(Number(val))}
        >
          <SelectTrigger className="w-[70px] text-black">
            <SelectValue placeholder="Pilih Jumlah" />
          </SelectTrigger>
          <SelectContent className="text-black bg-white">
            <SelectItem className="hover:bg-blue-500 hover:text-white" value="5">
              5
            </SelectItem>
            <SelectItem className="hover:bg-blue-500 hover:text-white" value="10">
              10
            </SelectItem>
            <SelectItem className="hover:bg-blue-500 hover:text-white" value="20">
              20
            </SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-gray-600">Data</span>
      </div>
  
      {/* Pagination */}
      <div className="flex justify-center sm:justify-end">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Tombol Prev */}
          <Button
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 text-sm font-medium rounded ${
              currentPage === 1
                ? "bg-gray-600 text-white cursor-not-allowed"
                : "bg-white text-gray-700 border hover:bg-gray-100"
            }`}
          >
            Prev
          </Button>
  
          {/* Nomor Halaman */}
          <div className="flex gap-2 flex-wrap justify-center">
            {getPageNumbers().map((page, idx) =>
              typeof page === "string" ? (
                <span key={idx} className="px-3 py-2 text-gray-400 select-none">
                  {page}
                </span>
              ) : (
                <Button
                  key={page}
                  onClick={() => changePage(page)}
                  className={`px-4 py-2 text-sm font-medium rounded ${
                    currentPage === page
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-white text-gray-700 border hover:bg-gray-100"
                  }`}
                >
                  {page}
                </Button>
              )
            )}
          </div>
  
          {/* Tombol Next */}
          <Button
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 text-sm font-medium rounded ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}  

// "use client";

// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// interface PaginationControlProps {
//   totalPages: number;
//   currentPage: number;
//   perPage: number;
//   onPageChange: (page: number, perPage: number) => void;
//   classname?: string;
// }

// export default function PaginationControl({
//   totalPages,
//   currentPage,
//   perPage,
//   onPageChange,
// }: PaginationControlProps) {
//   const changePage = (page: number) => {
//     if (page >= 1 && page <= totalPages) {
//       onPageChange(page, perPage);
//     }
//   };

//   const changePerPage = (value: number) => {
//     // kalau ganti jumlah per page, reset ke halaman 1
//     onPageChange(1, value);
//   };

//   // 🔹 Generate daftar halaman dengan ellipsis
//   const getPageNumbers = () => {
//     const pages: (number | string)[] = [];

//     if (totalPages <= 7) {
//       for (let i = 1; i <= totalPages; i++) {
//         pages.push(i);
//       }
//     } else {
//       pages.push(1);

//       if (currentPage > 4) {
//         pages.push("...");
//       }

//       const startPage = Math.max(2, currentPage - 1);
//       const endPage = Math.min(totalPages - 1, currentPage + 1);

//       for (let i = startPage; i <= endPage; i++) {
//         pages.push(i);
//       }

//       if (currentPage < totalPages - 3) {
//         pages.push("...");
//       }

//       pages.push(totalPages);
//     }

//     return pages;
//   };

//   return (
//     <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mt-4">
//       {/* 🔹 Bagian select jumlah data */}
//       <div className="flex items-center gap-2 justify-center sm:justify-start">
//         <span className="text-sm text-gray-600">Tampilkan:</span>
//         <Select
//           value={String(perPage)}
//           onValueChange={(val) => changePerPage(Number(val))}
//         >
//           <SelectTrigger className="w-[70px] text-black">
//             <SelectValue placeholder="Pilih Jumlah" />
//           </SelectTrigger>
//           <SelectContent className="text-black bg-white">
//             <SelectItem value="5">5</SelectItem>
//             <SelectItem value="10">10</SelectItem>
//             <SelectItem value="20">20</SelectItem>
//           </SelectContent>
//         </Select>
//         <span className="text-sm text-gray-600">Data</span>
//       </div>
  
//       {/* 🔹 Pagination */}
//       <div className="flex justify-center sm:justify-end">
//         {/* Mobile: hanya prev, current/total, next */}
//         <div className="flex items-center gap-2 sm:hidden">
//           <Button
//             onClick={() => changePage(currentPage - 1)}
//             disabled={currentPage === 1}
//             className="px-3 py-1 text-sm font-medium rounded bg-white border hover:bg-gray-100 disabled:bg-gray-200 disabled:text-gray-500"
//           >
//             Prev
//           </Button>
  
//           <span className="text-sm font-medium text-gray-700">
//             {currentPage} / {totalPages}
//           </span>
  
//           <Button
//             onClick={() => changePage(currentPage + 1)}
//             disabled={currentPage === totalPages}
//             className="px-3 py-1 text-sm font-medium rounded bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-200 disabled:text-gray-500"
//           >
//             Next
//           </Button>
//         </div>
  
//         {/* Desktop: full pagination */}
//         <div className="hidden sm:flex items-center gap-2">
//           {/* Prev */}
//           <Button
//             onClick={() => changePage(currentPage - 1)}
//             disabled={currentPage === 1}
//             className={`px-4 py-2 text-sm font-medium rounded ${
//               currentPage === 1
//                 ? "bg-gray-600 text-white cursor-not-allowed"
//                 : "bg-white text-gray-700 border hover:bg-gray-100"
//             }`}
//           >
//             Prev
//           </Button>
  
//           {/* Nomor halaman */}
//           <div className="flex gap-2">
//             {getPageNumbers().map((page, idx) =>
//               typeof page === "string" ? (
//                 <span
//                   key={idx}
//                   className="px-3 py-2 text-gray-400 select-none"
//                 >
//                   {page}
//                 </span>
//               ) : (
//                 <Button
//                   key={page}
//                   onClick={() => changePage(page)}
//                   className={`px-4 py-2 text-sm font-medium rounded ${
//                     currentPage === page
//                       ? "bg-blue-500 text-white hover:bg-blue-600"
//                       : "bg-white text-gray-700 border hover:bg-gray-100"
//                   }`}
//                 >
//                   {page}
//                 </Button>
//               )
//             )}
//           </div>
  
//           {/* Next */}
//           <Button
//             onClick={() => changePage(currentPage + 1)}
//             disabled={currentPage === totalPages}
//             className={`px-4 py-2 text-sm font-medium rounded ${
//               currentPage === totalPages
//                 ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//                 : "bg-blue-500 text-white hover:bg-blue-600"
//             }`}
//           >
//             Next
//           </Button>
//         </div>
//       </div>
//     </div>
//   );}