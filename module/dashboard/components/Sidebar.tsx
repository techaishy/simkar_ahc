"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";


interface SidebarGroupProps {
  children: ReactNode;
  className?: string;
}
export function SidebarGroup({ children, className }: SidebarGroupProps) {
  return <div className={cn("mb-6", className)}>{children}</div>;
}

interface SidebarGroupLabelProps {
  children: ReactNode;
  className?: string;
}
export function SidebarGroupLabel({
  children,
  className,
}: SidebarGroupLabelProps) {
  return (
    <div
      className={cn(
        "px-4 text-xs font-bold uppercase text-gray-400",
        className
      )}
    >
      {children}
    </div>
  );
}

interface SidebarGroupContentProps {
  children: ReactNode;
  className?: string;
}
export function SidebarGroupContent({
  children,
  className,
}: SidebarGroupContentProps) {
  return <div className={cn("mt-2 space-y-1", className)}>{children}</div>;
}

interface SidebarMenuProps {
  children: ReactNode;
  className?: string;
}
export function SidebarMenu({ children, className }: SidebarMenuProps) {
  return <div className={cn("space-y-1", className)}>{children}</div>;
}

interface SidebarMenuItemProps {
  children: ReactNode;
  className?: string;
}
export function SidebarMenuItem({ children, className }: SidebarMenuItemProps) {
  return <div className={cn("w-full", className)}>{children}</div>;
}

interface SidebarMenuButtonProps {
    icon?: ReactNode;
    label?: string;
    href?: string;
    className?: string;
    isActive?: boolean;
    asChild?: boolean;
    children?: ReactNode;
    onClick?: () => void;

  }
  
  export function SidebarMenuButton({
    icon,
    label,
    href = "#",
    className,
    isActive = false,
    asChild = false,
    children,
    onClick,
  }: SidebarMenuButtonProps) {
    const Comp = asChild ? Slot : "a";
    const handleClick = (e: React.MouseEvent) => {
      if (onClick) onClick(); 
    };
  
    return (
      <Comp
        {...(!asChild ? { href } : {})}
        className={cn(
          "flex items-center gap-3 rounded px-4 py-2 font-medium transition hover:bg-gray-800 hover:text-white",
          isActive ? "bg-gray-800 text-white" : "text-gray-300",
          className
        )}
        onClick={handleClick} 
      >
        {children ? (
          children
        ) : (
          <div className="flex items-center gap-3">
            {icon && <span className="text-xl">{icon}</span>}
            {label && <span>{label}</span>}
          </div>
        )}
      </Comp>
    );
  }
interface SidebarProps {
  children?: ReactNode;
  className?: string;
  collapsible?: string;
}
export function Sidebar({ children, className }: SidebarProps) {
  return (
    <aside className={cn(" text-white w-64 h-screen p-4 overflow-y-auto custom-scrollbar", className)}>
      {children}
    </aside>
  );
}
interface SidebarContentProps {
  children: ReactNode;
  className?: string;
}
export function SidebarContent({ children, className }: SidebarContentProps) {
  return <div className={cn("flex flex-col gap-4", className)}>{children}</div>;
}
interface SidebarFooterProps {
  children: ReactNode;
  className?: string;
}
export function SidebarFooter({ children, className }: SidebarFooterProps) {
  return <div className={cn("mt-auto", className)}>{children}</div>;
}
interface SidebarHeaderProps {
  children: ReactNode;
  className?: string;
}
export function SidebarHeader({ children, className }: SidebarHeaderProps) {
  return <div className={cn("mb-1", className)}>{children}</div>;
}
interface SidebarMenuSubProps {
  children: ReactNode;
  className?: string;
}

export function SidebarMenuSub({ children, className }: SidebarMenuSubProps) {
  return <div className={cn(" space-y-100", className)}>{children}</div>;
}
interface SidebarMenuSubButtonProps {
  icon?: ReactNode;
  label: string;
  href?: string;
  isActive?: boolean;
  className?: string;
  onClick?: () => void;
  
}

export function SidebarMenuSubButton({
  icon,
  label,
  href = "#",
  className,
  isActive = false,
  
}: SidebarMenuSubButtonProps) {
  return (
    <a
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-4 py-2 text-sm transition hover:bg-gray-800 hover:text-white",
        isActive ? "bg-gray-800 text-white" : "text-gray-400",
        className
      )}
    >
      {icon && <span className="text-lg">{icon}</span>}
      <span>{label}</span>
    </a>
  );
}
