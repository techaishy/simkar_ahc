
"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import type { Wilayah } from "@/module/satuan-kerja/Data Alat Faskes/DataAlatPage";

type Props = {
  wilayahList: Wilayah[];
  selectedWilayah: Wilayah | null;
  onWilayahChange: (w: Wilayah | null) => void;
  query: string;
  onQueryChange: (q: string) => void;
};

export default function FilterBar({ wilayahList, selectedWilayah, onWilayahChange, query, onQueryChange }: Props) {
  const [wilayahQuery, setWilayahQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // filter dummy berdasarkan query
  const filteredWilayah = wilayahList.filter((w) =>
    w.nama.toLowerCase().includes(wilayahQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col md:flex-row gap-3 md:items-center">
      {/* Searchable Satuan Kerja */}
     {/* Input untuk cari Satuan Kerja */}
<div className="relative w-full md:w-72">
  <input
    value={wilayahQuery}
    onChange={(e) => {
      setWilayahQuery(e.target.value);
      setShowDropdown(true);
    }}
    onFocus={() => {
      if (wilayahQuery.length > 0) {
        setShowDropdown(true);
      }
    }}
    placeholder="Cari Satuan Kerja..."
    className="w-full px-3 py-2 border rounded-md text-black bg-white"
  />

  {/* Dropdown hanya muncul kalau ada input */}
  {showDropdown && wilayahQuery.length > 0 && (
    <div className="absolute top-full left-0 w-full bg-white border rounded-md mt-1 shadow-md max-h-48 overflow-y-auto z-20">
      {filteredWilayah.length === 0 && (
        <div className="px-3 py-2 text-gray-500 text-sm">Tidak ditemukan</div>
      )}
      {filteredWilayah.map((w) => (
        <div
          key={w.id}
          className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
            selectedWilayah?.id === w.id ? "bg-gray-200" : ""
          }`}
          onClick={() => {
            onWilayahChange(w);
            setWilayahQuery(w.nama);
            setShowDropdown(false);
          }}
        >
          {w.nama}
        </div>
      ))}
    </div>
  )}
</div>


      <div className="flex items-center gap-2 w-full md:w-auto">
      {/* Search Alat */}
      <div className="flex items-end text-black bg-white border rounded-md px-3 py-2 shadow-sm w-full md:max-w-xl">
        <Search className="mr-2" />
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search nama alat..."
          className="outline-none w-full"
        />
      </div>
      </div>
    </div>
  );
}
