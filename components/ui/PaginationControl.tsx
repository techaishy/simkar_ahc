"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface PaginationControlProps {
  totalPages: number;
  onPageChange: (page: number, perPage: number) => void;
  currentPage: number;
}



export default function PaginationControl({ totalPages, onPageChange }: PaginationControlProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(7);

  const changePage = (page: number) => {
    setCurrentPage(page);
    onPageChange(page, perPage);
  };

  return (
    <div className="flex items-center justify-between gap-4 mt-4">
  
      {/* Tombol Pagination */}
      <div className="flex gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            variant="outline"
            onClick={() => changePage(page)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors
              ${currentPage === page
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
              }`}
          >
            {page}
          </Button>
        ))}
      </div>
    </div>
  );
}
