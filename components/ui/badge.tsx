import { cn } from "@/lib/utils";

type BadgeProps = {
    children: React.ReactNode;
    variant?: "default" | "secondary" | "destructive" | "outline";
    className?: string;
  };
  
  export function Badge({ children, variant = "default", className }: BadgeProps) {
    const baseStyle =
      "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold";
  
    const variants: Record<NonNullable<BadgeProps["variant"]>, string> = {
      default: "bg-green-100 text-green-800",
      secondary: "bg-blue-100 text-blue-800",
      destructive: "bg-red-100 text-red-800",
      outline: "border border-gray-300 text-gray-800",
    };
  
    return (
      <span className={cn(baseStyle, variants[variant], className)}>
        {children}
      </span>
    );
  }
  