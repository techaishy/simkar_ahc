"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconChevronDown, IconChevronRight } from "@tabler/icons-react";
import { UserRole } from "@/lib/types/user";
import { MenuItem } from "@/lib/menu-items";

type NavMainItem = {
  title: string;
  url: string;
  icon: React.ElementType;
  roles?: UserRole[];
  items?: NavMainItem[];
};

export function NavMain({ items, role }: { items: MenuItem[]; role: UserRole }) {
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const pathname = usePathname();

  const toggle = (title: string) => {
    setOpenMenus((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  // Map MenuItem ke NavMainItem
  const mappedItems: NavMainItem[] = items
    .map((item) => ({
      title: item.name,
      url: item.href,
      icon: item.icon,
      roles: item.allowedRoles,
      items: item.items?.map((sub) => ({
        title: sub.name,
        url: sub.href,
        icon: sub.icon,
        roles: sub.allowedRoles,
      })),
    }))
    // Filter berdasarkan role user
    .map((item) => ({
      ...item,
      items: item.items?.filter((sub) => sub.roles?.includes(role)),
    }))
    .filter((item) => item.roles?.includes(role) || (item.items && item.items.length > 0));

  return (
    <nav className="space-y-1 px-4 py-2">
      {mappedItems.map((item) => {
        const Icon = item.icon;
        const hasChildren = !!item.items?.length;
        const isOpen = openMenus.includes(item.title);
        const isActiveParent =
          pathname === item.url || item.items?.some((sub) => pathname === sub.url);
        const isActive = pathname === item.url;

        return (
          <div key={item.title}>
            {hasChildren ? (
              <>
                <button
                  onClick={() => toggle(item.title)}
                  className={`flex items-center w-full text-left px-2 py-2 rounded
                    ${
                      isActiveParent
                        ? "text-black bg-gradient-to-r from-[#d2e67a] to-[#f9fc4f]"
                        : "text-gray-300 hover:text-black hover:bg-gradient-to-r hover:from-[#d2e67a] hover:to-[#f9fc4f]"
                    }`}
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
                  <div className="pl-8 mt-1 space-y-1 border-l border-gray-600">
                    {item.items?.map((sub) => {
                      const isSubActive = pathname === sub.url;
                      return (
                        <Link
                          key={sub.title}
                          href={sub.url}
                          className={`block px-2 py-1 text-[15px] rounded
                            ${
                              isSubActive
                                ? "text-black bg-gradient-to-r from-[#d2e67a] to-[#f9fc4f]"
                                : "text-gray-300 hover:text-black hover:bg-gradient-to-r hover:from-[#d2e67a] hover:to-[#f9fc4f]"
                            }`}
                        >
                          {sub.title}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </>
            ) : (
              <Link
                href={item.url}
                className={`flex items-center px-2 py-2 rounded
                  ${
                    isActive
                      ? "text-black bg-gradient-to-r from-[#d2e67a] to-[#f9fc4f]"
                      : "text-gray-300 hover:text-black hover:bg-gradient-to-r hover:from-[#d2e67a] hover:to-[#f9fc4f]"
                  }`}
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
