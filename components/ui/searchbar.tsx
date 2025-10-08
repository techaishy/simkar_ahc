"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({ onSearch, placeholder = "Cari..." }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    onSearch(query.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex items-center gap-2 w-full max-w-sm">
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-1"
      />
      <Button onClick={handleSearch} className="flex items-center gap-1">
        <Search size={16} />
        Cari
      </Button>
    </div>
  );
}
