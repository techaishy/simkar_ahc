"use client";

import { useState } from "react";
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
}

export default function PaginationControl({
  totalPages,
  onPageChange,
}: PaginationControlProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const changePage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      onPageChange(page, perPage);
    }
  };

  const handlePerPageChange = (value: string) => {
    const newPerPage = parseInt(value, 10);
    setPerPage(newPerPage);
    setCurrentPage(1);
    onPageChange(1, newPerPage);
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        start = 2;
        end = 4;
      } else if (currentPage >= totalPages - 2) {
        start = totalPages - 3;
        end = totalPages - 1;
      }

      if (start > 2) pages.push("...");
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages - 1) pages.push("...");

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-between mt-4 w-full flex-wrap gap-4">
      {/* Dropdown Per Page */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Tampilkan</span>
        <Select value={perPage.toString()} onValueChange={handlePerPageChange}>
          <SelectTrigger className="w-[80px]">
            <SelectValue placeholder="10" />
          </SelectTrigger>
           <SelectContent className="bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
            <SelectItem
              value="5"
              className="hover:bg-primary/80 focus:bg-primary focus:text-primary-foreground"
            >
              5
            </SelectItem>
            <SelectItem
              value="10"
              className="hover:bg-primary/80 focus:bg-primary focus:text-primary-foreground"
            >
              10
            </SelectItem>
            <SelectItem
              value="20"
              className="hover:bg-primary/80 focus:bg-primary focus:text-primary-foreground"
            >
              20
            </SelectItem>
            <SelectItem
              value="50"
              className="hover:bg-primary/80 focus:bg-primary focus:text-primary-foreground"
            >
              50
            </SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-gray-600">per halaman</span>
      </div>

      {/* Pagination */}
      <div className="flex items-center gap-2 flex-wrap justify-center">
        {/* Tombol Prev */}
        <Button
          onClick={() => changePage(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 text-sm font-medium rounded
            ${
              currentPage === 1
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-white text-gray-700 border hover:bg-gray-100"
            }`}
        >
          Prev
        </Button>

        {/* Nomor Halaman */}
        {getPageNumbers().map((page, idx) =>
          typeof page === "string" ? (
            <span
              key={`ellipsis-${idx}`}
              className="px-3 py-2 text-gray-400 select-none"
            >
              {page}
            </span>
          ) : (
            <Button
              key={page}
              onClick={() => changePage(page)}
              className={`px-4 py-2 text-sm font-medium rounded
                ${
                  currentPage === page
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-white text-gray-700 border hover:bg-gray-100"
                }`}
            >
              {page}
            </Button>
          )
        )}

        {/* Tombol Next */}
        <Button
          onClick={() => changePage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 text-sm font-medium rounded
            ${
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
