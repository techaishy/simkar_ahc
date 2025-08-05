import { ReactNode } from "react";
import { cn } from "@/lib/utils"; 

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-gray-800 bg-white shadow-gray-600 shadow-lg p-1",
        className
      )}
    >
      {children}
    </div>
  );
}
