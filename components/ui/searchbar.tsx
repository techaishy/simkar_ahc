"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

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
    <div className="w-full max-w-sm">
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full"
      />
    </div>
  );
}
