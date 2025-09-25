
"use client";

import { Button } from "@/components/ui/button";

interface PaginationControlProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  classname?: string;
}

export default function PaginationControl({
  totalPages,
  currentPage,
  onPageChange,
}: PaginationControlProps) {
  const changePage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

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
    <div className="w-full mt-4 flex justify-center sm:justify-end">
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
  );
}

