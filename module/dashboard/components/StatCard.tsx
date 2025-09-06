import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon?: ReactNode;
  value: number | string;
  label: string;
  className?: string;
  bgColor?: string;
}

export default function StatCard({
  icon,
  value,
  label,
  className,
  bgColor = "bg-green-600",
}: StatCardProps) {
  return (
    <div
      className={cn(
        "w-100% flex m-2.5 items-center justify-between rounded-md px-5 py-3 aspect-[4/2] shadow-sm text-white transition-all duration-300",
        bgColor,
        className
      )}
    >
      <div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-sm uppercase tracking-wide">{label}</div>
      </div>
      {icon && (
        <div className="w-10 h-10 bg-white/20 rounded-full opacity-80 flex items-center justify-center text-white">
          {icon}
        </div>
      )}
    </div>
  );
}

export { StatCard };
