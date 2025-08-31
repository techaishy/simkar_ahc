import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
          // ukuran & padding
          "flex h-9 w-full rounded-md px-3 py-2 text-sm outline-none",
          // warna teks
          "text-foreground placeholder:text-muted-foreground",
          // border & background (dark/light friendly)
          "bg-transparent border border-gray-600 focus:border-primary focus:ring-1 focus:ring-primary",
          // disabled state
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
      )}
      {...props}
    />
  )
}

export { Input }
