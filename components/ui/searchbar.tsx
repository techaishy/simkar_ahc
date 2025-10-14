"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react"; 

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  delay?: number; 
}

export default function SearchBar({
  onSearch,
  placeholder = "Cari...",
  delay = 200,
}: SearchBarProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(query.trim());
    }, delay);

    return () => clearTimeout(handler);
  }, [query, delay, onSearch]);

  return (
    <div className="relative w-full max-w-sm">
      {/* Icon pencarian */}
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="w-5 h-5 text-gray-400" />
      </div>

      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10" 
      />
    </div>
  );
}
