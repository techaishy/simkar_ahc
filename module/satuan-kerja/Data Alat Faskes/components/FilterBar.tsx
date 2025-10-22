"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import type { Wilayah } from "@/module/satuan-kerja/Data Alat Faskes/DataAlatPage";

type Props = {
  wilayahList: Wilayah[];
  selectedWilayah: Wilayah | null;
  onWilayahChange: (w: Wilayah | null) => void;
  query: string;
  onQueryChange: (q: string) => void;
};

export default function FilterBar({
  wilayahList,
  selectedWilayah,
  onWilayahChange,
  query,
  onQueryChange,
}: Props) {
  const [wilayahQuery, setWilayahQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredWilayah = wilayahList
    .filter((w) =>
      w.nama.toLowerCase().includes(wilayahQuery.toLowerCase())
    )
    .slice(0, 5);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (selectedWilayah) {
      setWilayahQuery(selectedWilayah.nama);
    }
  }, [selectedWilayah]);

  useEffect(() => {
    if (
      selectedWilayah &&
      wilayahQuery.toLowerCase() !== selectedWilayah.nama.toLowerCase()
    ) {
      onWilayahChange(null);
    }
  }, [wilayahQuery]);

  return (
    <div className="flex flex-col md:flex-row gap-3 md:items-center">
      {/* Autocomplete Wilayah */}
    <div className="relative w-full md:w-72" ref={containerRef}>
      <input
        value={wilayahQuery}
        onChange={(e) => { setWilayahQuery(e.target.value); setShowDropdown(true); }}
        onFocus={() => { if (wilayahQuery.trim().length > 0) setShowDropdown(true); }}
        placeholder="Cari Satuan Kerja..."
        className="w-full px-3 py-2 border rounded-md text-gray-900 bg-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-indigo-400 outline-none"
      />
      {showDropdown && wilayahQuery.trim().length > 0 && (
        <div className="absolute top-full left-0 w-full bg-gray-200 border border-gray-300 rounded-md mt-1 shadow-lg max-h-48 overflow-y-auto z-30">
          {filteredWilayah.length === 0 ? (
            <div className="px-3 py-2 text-gray-600 text-sm">Tidak ditemukan</div>
          ) : (
            filteredWilayah.map((w) => (
              <div
                key={w.id}
                className={`px-3 py-2 cursor-pointer hover:bg-gray-300 ${selectedWilayah?.id === w.id ? "bg-gray-300" : ""} text-gray-900`}
                onClick={() => { onWilayahChange(w); setWilayahQuery(w.nama); setShowDropdown(false); }}
              >
                {w.nama}
              </div>
            ))
          )}
        </div>
      )}
    </div>


      {/* Search Alat */}
      <div className="flex items-center gap-2 w-full md:w-auto">
        <div className="flex items-center text-black bg-white border rounded-md px-3 py-2 shadow-sm w-full md:max-w-xl">
          <Search className="mr-2" />
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Cari nama alat..."
            className="outline-none w-full"
          />
        </div>
      </div>
    </div>
  );
}
