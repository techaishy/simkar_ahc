"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({ onSearch, placeholder = "Cari..." }: SearchBarProps) {
  const [query, setQuery] = useState("");

  return (
    <div className="flex items-center gap-2 w-full max-w-sm relative">
      <Search size={16} className="absolute left-3 text-gray-400" />
      <Input
        type="text"
        value={query}
        onChange={(e) => {
          const value = e.target.value;
          setQuery(value);
          onSearch(value.trim()); 
        }}
        placeholder={placeholder}
        className="flex-1 pl-9" 
      />
    </div>
  );
}
