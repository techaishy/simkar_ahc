"use client";

import { useState } from "react";
import Link from "next/link";
import { IconChevronDown, IconChevronRight } from "@tabler/icons-react";

type NavMainItem = {
  title: string;
  url: string;
  icon: React.ElementType;
  items?: {
    title: string;
    url: string;
  }[];
};

export function NavMain({ items }: { items: NavMainItem[] }) {
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const toggle = (title: string) => {
    setOpenMenus(prev =>
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  };

  return (
    <nav className="space-y-1 px-4 py-2">
      {items.map((item) => {
        const Icon = item.icon;
        const hasChildren = !!item.items?.length;
        const isOpen = openMenus.includes(item.title);

        return (
          <div key={item.title}>
            {hasChildren ? (
              <>
                <button
                  onClick={() => toggle(item.title)}
                  className="flex items-center w-full text-left px-2 py-2 hover:bg-gray-700 rounded"
                >
                  <Icon className="w-5 h-5" />
                  <span className="ml-3 flex-1">{item.title}</span>
                  {isOpen ? (
                    <IconChevronDown className="w-4 h-4" />
                  ) : (
                    <IconChevronRight className="w-4 h-4" />
                  )}
                </button>
                {isOpen && (
                  <div className="pl-8 mt-1 space-y-1 border-l border-gray-700">
                    {item.items?.map((sub) => (
                      <Link
                        key={sub.title}
                        href={sub.url}
                        className="block px-2 py-1 text-[15px] text-gray-300 hover:text-white"
                      >
                        {sub.title}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link
                href={item.url}
                className="flex items-center px-2 py-2 hover:bg-gray-700 rounded"
              >
                <Icon className="w-5 h-5" />
                <span className="ml-3">{item.title}</span>
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}

